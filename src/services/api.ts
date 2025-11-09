// Use a relative API base so the frontend talks to the same host it was served from.
// This avoids hardcoding localhost in production (which causes ERR_CONNECTION_REFUSED
// when the site is served from a remote host).
const API_BASE_URL = '/api';

export interface Distributor {
  id: number;
  name: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  experience: string;
  logo?: string;
  // backend may provide coordinates
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateDistributorData {
  name: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  experience: string;
}

export interface UpdateDistributorData extends CreateDistributorData {
  logo?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Distributors API
  async getDistributors(): Promise<Distributor[]> {
    return this.request<Distributor[]>('/distributors');
  }

  async getDistributor(id: number): Promise<Distributor> {
    return this.request<Distributor>(`/distributors/${id}`);
  }

  async createDistributor(data: CreateDistributorData, logo?: File): Promise<Distributor> {
    const formData = new FormData();

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add logo file if provided
    if (logo) {
      formData.append('logo', logo);
    }

    const response = await fetch(`${API_BASE_URL}/distributors`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async updateDistributor(id: number, data: UpdateDistributorData, logo?: File): Promise<Distributor> {
    const formData = new FormData();

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add logo file if provided
    if (logo) {
      formData.append('logo', logo);
    }

    const response = await fetch(`${API_BASE_URL}/distributors/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async deleteDistributor(id: number): Promise<void> {
    await this.request(`/distributors/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderDistributors(distributorIds: number[]): Promise<void> {
    await this.request('/distributors/reorder', {
      method: 'PUT',
      body: JSON.stringify({ distributorIds }),
    });
  }
}

export const apiService = new ApiService();