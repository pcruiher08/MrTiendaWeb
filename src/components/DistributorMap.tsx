import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// marker clustering (improves client rendering perf for many markers)
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Fix default icon paths for Leaflet when using bundlers (Vite)
// Import the images so the bundler returns proper URLs instead of leaving require() calls in the bundle
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Ensure the default icon options point to the bundled asset URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export type DistributorLite = {
  id: number;
  name: string;
  city?: string | null;
  contact?: string | null;
  phone?: string | null;
  email?: string | null;
  logo?: string | null;
  // optional coordinates — backend may already provide these
  latitude?: number | null;
  longitude?: number | null;
};

type Point = { lat: number; lon: number };

// No client-side geocoding: frontend relies on backend-provided `latitude`/`longitude` fields.

export default function DistributorMap({ distributors }: { distributors: DistributorLite[] }) {
  const [points, setPoints] = useState<Record<number, Point>>({});

  useEffect(() => {
    // Build points map from distributor-provided coordinates only. No client geocoding.
    const initial: Record<number, Point> = {};
    for (const d of distributors) {
      if (typeof d.latitude === 'number' && typeof d.longitude === 'number') {
        initial[d.id] = { lat: d.latitude, lon: d.longitude };
      }
    }
    setPoints(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributors]);

  // center based on first available point or fallback to Mexico City
  const firstPoint = Object.values(points)[0];
  const center: [number, number] = firstPoint ? [firstPoint.lat, firstPoint.lon] : [19.432608, -99.133209];

  return (
    <div className="h-96 w-full rounded shadow">
      <MapContainer center={center} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Temporarily disable clustering to test */}
        {/* <ClusterMarkers points={points} distributors={distributors} /> */}
      </MapContainer>
    </div>
  );
}

function escapeHtml(str?: string | null) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ClusterMarkers({ points, distributors }: { points: Record<number, Point>; distributors: DistributorLite[] }) {
  const map = useMap();

  useEffect(() => {
    // create cluster group
    const cluster = (L as any).markerClusterGroup ? (L as any).markerClusterGroup() : (L as any).markerClusterGroup?.();
    // Fallback if plugin isn't available
    if (!cluster) return;

    for (const d of distributors) {
      const p = points[d.id];
      if (!p) continue;
      const marker = L.marker([p.lat, p.lon]);
      const popup = `
        <div class="max-w-xs">
          <div class="font-bold">${escapeHtml(d.name)}</div>
          <div class="text-sm text-slate-600">${escapeHtml(d.city)}</div>
          ${d.contact ? `<div class="text-sm">Contacto: ${escapeHtml(d.contact)}</div>` : ''}
          ${d.phone ? `<div class="text-sm">Tel: ${escapeHtml(d.phone)}</div>` : ''}
          ${d.email ? `<div class="text-sm">${escapeHtml(d.email)}</div>` : ''}
        </div>
      `;
      marker.bindPopup(popup);
      cluster.addLayer(marker);
    }

    map.addLayer(cluster);
    return () => {
      try { map.removeLayer(cluster); } catch (e) { /* ignore */ }
    };
  // intentionally depend on distributors and points
  }, [map, distributors, JSON.stringify(points)]);

  return null;
}
