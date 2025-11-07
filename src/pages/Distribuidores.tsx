
import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Users, Award, Globe, Plus, Edit, Trash2, Upload, AlertCircle, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, type Distributor } from "@/services/api";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Distribuidores = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Distributor | null>(null);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newDistributor, setNewDistributor] = useState({
    name: '',
    city: '',
    contact: '',
    phone: '',
    email: '',
    experience: ''
  });

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<Distributor | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Load distributors on component mount
  useEffect(() => {
    loadDistributors();
  }, []);

  const loadDistributors = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDistributors();
      setDistributors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load distributors');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewDistributor({ name: '', city: '', contact: '', phone: '', email: '', experience: '' });
    setSelectedLogo(null);
    setLogoPreview(null);
  };

  const handleAddDistributor = async () => {
    if (!newDistributor.name || !newDistributor.city || !newDistributor.contact || !newDistributor.phone || !newDistributor.email) {
      setError('Por favor complete los campos requeridos antes de enviar.');
      return;
    }

    try {
      const distributorData = {
        name: newDistributor.name,
        city: newDistributor.city,
        contact: newDistributor.contact,
        phone: newDistributor.phone,
        email: newDistributor.email,
        experience: newDistributor.experience || 'Nuevo'
      };

      const newItem = await apiService.createDistributor(distributorData, selectedLogo || undefined);
      // Refresh list from server so ordering/positions are consistent
      await loadDistributors();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add distributor');
    }
  };

  const handleEditDistributor = (distributor: Distributor) => {
    setEditingItem(distributor);
    setNewDistributor({
      name: distributor.name,
      city: distributor.city,
      contact: distributor.contact,
      phone: distributor.phone,
      email: distributor.email,
      experience: distributor.experience
    });
    setLogoPreview(distributor.logo || null);
    setSelectedLogo(null);
  };

  const handleUpdateDistributor = async () => {
    if (!editingItem || !newDistributor.name || !newDistributor.city || !newDistributor.contact || !newDistributor.phone || !newDistributor.email) {
      setError('Por favor complete los campos requeridos antes de actualizar.');
      return;
    }

    try {
      const distributorData = {
        name: newDistributor.name,
        city: newDistributor.city,
        contact: newDistributor.contact,
        phone: newDistributor.phone,
        email: newDistributor.email,
        experience: newDistributor.experience
      };

      const updatedItem = await apiService.updateDistributor(editingItem.id, distributorData, selectedLogo || undefined);
      // Refresh list from server so any position changes are reflected
      await loadDistributors();
      setEditingItem(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update distributor');
    }
  };

  const handleDeleteDistributor = async (id: number) => {
    try {
      await apiService.deleteDistributor(id);
      setDistributors(distributors.filter(d => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete distributor');
    }
  };

  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, distributor: Distributor) => {
    setDraggedItem(distributor);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetDistributor: Distributor) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetDistributor.id) {
      setDraggedItem(null);
      return;
    }

    try {
      setIsReordering(true);
      
      // Create new order array
      const currentOrder = distributors.map(d => d.id);
      const draggedIndex = currentOrder.indexOf(draggedItem.id);
      const targetIndex = currentOrder.indexOf(targetDistributor.id);
      
      // Remove dragged item and insert at target position
      const newOrder = [...currentOrder];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem.id);
      
      // Update local state immediately for better UX
      const reorderedDistributors = newOrder.map(id => 
        distributors.find(d => d.id === id)!
      );
      setDistributors(reorderedDistributors);
      
      // Send reorder request to backend
  await apiService.reorderDistributors(newOrder);
  // Re-fetch from server to ensure positions are the source of truth
  await loadDistributors();
      
    } catch (err) {
      // Revert on error
      await loadDistributors();
      setError(err instanceof Error ? err.message : 'Failed to reorder distributors');
    } finally {
      setDraggedItem(null);
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            Red de Distribuidores
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Distribuidores
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}Autorizados
            </span>
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Profesionales altamente cualificados y motivados
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Nuestra empresa cuenta con 25 años de experiencia en el desarrollo e implementación de puntos de venta.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            Nuestra red de distribuidores está compuesta de personas altamente capacitadas y profesionales
            para brindarle una excelente atención.
          </p>

          {/* Admin Actions */}
          {isAuthenticated && isAdmin && (
            <div className="mt-8">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Distribuidor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Distribuidor</DialogTitle>
                    <DialogDescription>
                      Complete la información del nuevo distribuidor
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre de la Empresa</Label>
                      <Input
                        id="name"
                        value={newDistributor.name}
                        onChange={(e) => setNewDistributor({...newDistributor, name: e.target.value})}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={newDistributor.city}
                        onChange={(e) => setNewDistributor({...newDistributor, city: e.target.value})}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact">Contacto</Label>
                      <Input
                        id="contact"
                        value={newDistributor.contact}
                        onChange={(e) => setNewDistributor({...newDistributor, contact: e.target.value})}
                        placeholder="Nombre del contacto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={newDistributor.phone}
                        onChange={(e) => setNewDistributor({...newDistributor, phone: e.target.value})}
                        placeholder="+52 (XXX) XXX-XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newDistributor.email}
                        onChange={(e) => setNewDistributor({...newDistributor, email: e.target.value})}
                        placeholder="contacto@empresa.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Años de Experiencia</Label>
                      <Input
                        id="experience"
                        value={newDistributor.experience}
                        onChange={(e) => setNewDistributor({...newDistributor, experience: e.target.value})}
                        placeholder="ej: 5 años"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logo">Logo (opcional)</Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleLogoSelect}
                        className="cursor-pointer"
                      />
                      {logoPreview && (
                        <div className="mt-2">
                          <img src={logoPreview} alt="Logo preview" className="h-16 w-auto object-contain border rounded" />
                        </div>
                      )}
                    </div>
                    <Button onClick={handleAddDistributor} className="w-full">
                      Agregar Distribuidor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-slate-700">25</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-slate-700">{distributors.length}</div>
              <div className="text-gray-600">Distribuidores</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-slate-700">16,000+</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-slate-700">100%</div>
              <div className="text-gray-600">Disponibilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Distributors Grid */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Encuentra tu Distribuidor Más Cercano
            </h2>
            <p className="text-xl text-gray-600">
              Nuestra red de distribuidores autorizados está estratégicamente ubicada en las principales ciudades de México
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {distributors.map((distributor) => (
              <Card 
                key={distributor.id} 
                className={`hover:shadow-lg transition-shadow duration-300 ${
                  draggedItem?.id === distributor.id ? 'opacity-50' : ''
                } ${isReordering ? 'pointer-events-none' : ''}`}
                draggable={isAuthenticated && isAdmin}
                onDragStart={(e) => handleDragStart(e, distributor)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, distributor)}
                onDragEnd={handleDragEnd}
              >
                <CardHeader className="text-center">
                  {isAuthenticated && isAdmin && (
                    <div className="flex justify-center mb-2">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    </div>
                  )}
                  {distributor.logo && (
                    <div className="flex justify-center mb-4">
                      <img
                        // Use relative URL so images are requested from the same origin
                        // the app is served from (works locally and when deployed).
                        src={distributor.logo?.startsWith('http') ? distributor.logo : distributor.logo}
                        alt={`${distributor.name} logo`}
                        className="h-16 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {distributor.name}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {distributor.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-slate-600" />
                      <span className="font-medium">{distributor.contact}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-600" />
                      <span>{distributor.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span>{distributor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="h-4 w-4 text-slate-600" />
                      <span>{distributor.experience} de experiencia</span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAuthenticated && isAdmin && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDistributor(distributor)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDistributor(distributor.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {/* Reordering indicator */}
          {isReordering && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
                <span className="text-lg font-medium">Reordenando distribuidores...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Distribuidor</DialogTitle>
              <DialogDescription>
                Modifique la información del distribuidor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre de la Empresa</Label>
                <Input
                  id="edit-name"
                  value={newDistributor.name}
                  onChange={(e) => setNewDistributor({...newDistributor, name: e.target.value})}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <Label htmlFor="edit-city">Ciudad</Label>
                <Input
                  id="edit-city"
                  value={newDistributor.city}
                  onChange={(e) => setNewDistributor({...newDistributor, city: e.target.value})}
                  placeholder="Ciudad"
                />
              </div>
              <div>
                <Label htmlFor="edit-contact">Contacto</Label>
                <Input
                  id="edit-contact"
                  value={newDistributor.contact}
                  onChange={(e) => setNewDistributor({...newDistributor, contact: e.target.value})}
                  placeholder="Nombre del contacto"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  value={newDistributor.phone}
                  onChange={(e) => setNewDistributor({...newDistributor, phone: e.target.value})}
                  placeholder="+52 (XXX) XXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newDistributor.email}
                  onChange={(e) => setNewDistributor({...newDistributor, email: e.target.value})}
                  placeholder="contacto@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-experience">Años de Experiencia</Label>
                <Input
                  id="edit-experience"
                  value={newDistributor.experience}
                  onChange={(e) => setNewDistributor({...newDistributor, experience: e.target.value})}
                  placeholder="ej: 5 años"
                />
              </div>
              <div>
                <Label htmlFor="edit-logo">Logo</Label>
                <Input
                  id="edit-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoSelect}
                  className="cursor-pointer"
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img src={logoPreview} alt="Logo preview" className="h-16 w-auto object-contain border rounded" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateDistributor} className="flex-1">
                  Actualizar
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Become Distributor CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Award className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">
            ¿Te interesa ser Distribuidor?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a nuestra red de distribuidores autorizados y forma parte del éxito de Mr. Tienda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto" className="w-full sm:w-auto">
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-700 transition-colors">
              Contactar
            </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Distribuidores;
