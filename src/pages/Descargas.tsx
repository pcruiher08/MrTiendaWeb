import { Download, FileText, Shield, Calendar, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  icon: JSX.Element;
  fileName: string;
}

const Descargas = () => {
  const { isAuthenticated, isClient, isAdmin } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: '1',
      title: "Versión Beta 3 de junio 2025 Incluye Mrtimbre",
      description: "Es muy importante descargar todos los archivos de este beta para actualizar. (incluyendo los archivos: .DLL) Resuelto el detalle de redondeo de los decimales en la factura.",
      date: "3 de junio 2025",
      type: "Beta",
      icon: <FileText className="h-6 w-6" />,
      fileName: "beta-mrtienda-junio-2025.zip"
    },
    {
      id: '2',
      title: "Cambios en la versión Beta 3 de junio 2025",
      description: "SE CORRIGIÓ EL PROBLEMA DE LAS LLAVES VIRTUALES AL CAMBIAR VERSIÓN DE WINDOWS. SE CORRIGIO EL PROBLEMA DE LA DIFERENCIA DE LOS DECIMALES AL FACTURAR. SE ACTUALIZÓ EL EASYONE.DLL",
      date: "3 de junio 2025",
      type: "Documentación",
      icon: <FileText className="h-6 w-6" />,
      fileName: "cambios-beta-junio-2025.pdf"
    },
    {
      id: '3',
      title: "Instalador Mrtienda y Mrtienda Básico",
      description: "Versión necesaria para utilizar \"La Nube\".",
      date: "15 de noviembre 2024",
      type: "Instalador",
      icon: <Download className="h-6 w-6" />,
      fileName: "instalador-mrtienda-basico.exe"
    },
    {
      id: '4',
      title: "Instalador Mrtimbre",
      description: "Instalador oficial del módulo de timbrado.",
      date: "22 de julio",
      type: "Instalador",
      icon: <Download className="h-6 w-6" />,
      fileName: "instalador-mrtimbre.exe"
    },
    {
      id: '5',
      title: "Runtime de Visual Studio",
      description: "Componentes necesarios para el funcionamiento del sistema.",
      date: "",
      type: "Runtime",
      icon: <Download className="h-6 w-6" />,
      fileName: "runtime-visual-studio.exe"
    },
    {
      id: '6',
      title: "Driver Microdog Windows 10",
      description: "Driver para dispositivos de protección en Windows 10.",
      date: "",
      type: "Driver",
      icon: <Download className="h-6 w-6" />,
      fileName: "driver-microdog-win10.exe"
    },
    {
      id: '7',
      title: "Driver lector huella digital RTE.ZIP",
      description: "Driver para lectores de huella digital compatibles.",
      date: "",
      type: "Driver",
      icon: <Download className="h-6 w-6" />,
      fileName: "driver-huella-digital-rte.zip"
    },
    {
      id: '8',
      title: "MrMovil / Instalador",
      description: "Aplicación móvil para el manejo del sistema.",
      date: "",
      type: "App Móvil",
      icon: <Download className="h-6 w-6" />,
      fileName: "mrmovil-instalador.apk"
    },
    {
      id: '9',
      title: "MrMovil nuevo ejecutable",
      description: "Después de instalar el módulo con el instalador, reemplazar el EXE del instalador por este.",
      date: "19 de julio de 2024",
      type: "Actualización",
      icon: <Download className="h-6 w-6" />,
      fileName: "mrmovil-ejecutable-nuevo.exe"
    },
    {
      id: '10',
      title: "Complemento Carta Porte 3.1",
      description: "Nueva librería para soportar esta versión.",
      date: "",
      type: "Complemento",
      icon: <Download className="h-6 w-6" />,
      fileName: "complemento-carta-porte-31.dll"
    },
    {
      id: '11',
      title: "mrRPM Instalador",
      description: "Instalador del módulo de recarga de productos y servicios.",
      date: "",
      type: "Instalador",
      icon: <Download className="h-6 w-6" />,
      fileName: "mrrpm-instalador.exe"
    }
  ]);

  const [newDownload, setNewDownload] = useState({
    title: '',
    description: '',
    date: '',
    type: '',
    fileName: ''
  });

  const handleDownload = (fileName: string, title: string) => {
    // Create download link for file from public/downloads directory
    const link = document.createElement('a');
    link.href = `/downloads/${fileName}`;
    link.download = fileName;
    link.click();

    // Log the download for analytics if needed
    console.log(`Downloaded: ${title} - ${fileName}`);
  };

  const handleAddDownload = () => {
    if (!newDownload.title || !newDownload.description || !newDownload.type || !newDownload.fileName) {
      return;
    }

    const download: DownloadItem = {
      id: Date.now().toString(),
      title: newDownload.title,
      description: newDownload.description,
      date: newDownload.date,
      type: newDownload.type,
      icon: <FileText className="h-6 w-6" />,
      fileName: newDownload.fileName
    };

    setDownloads([...downloads, download]);
    setNewDownload({ title: '', description: '', date: '', type: '', fileName: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditDownload = (download: DownloadItem) => {
    setEditingItem(download);
    setNewDownload({
      title: download.title,
      description: download.description,
      date: download.date,
      type: download.type,
      fileName: download.fileName
    });
  };

  const handleUpdateDownload = () => {
    if (!editingItem || !newDownload.title || !newDownload.description || !newDownload.type || !newDownload.fileName) {
      return;
    }

    setDownloads(downloads.map(d =>
      d.id === editingItem.id
        ? {
            ...d,
            title: newDownload.title,
            description: newDownload.description,
            date: newDownload.date,
            type: newDownload.type,
            fileName: newDownload.fileName
          }
        : d
    ));

    setEditingItem(null);
    setNewDownload({ title: '', description: '', date: '', type: '', fileName: '' });
  };

  const handleDeleteDownload = (id: string) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Beta": return "bg-orange-100 text-orange-700";
      case "Instalador": return "bg-slate-100 text-slate-700";
      case "Driver": return "bg-green-100 text-green-700";
      case "App Móvil": return "bg-purple-100 text-purple-700";
      case "Complemento": return "bg-yellow-100 text-yellow-700";
      case "Documentación": return "bg-blue-100 text-blue-700";
      case "Actualización": return "bg-red-100 text-red-700";
      case "Runtime": return "bg-indigo-100 text-indigo-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Navbar />
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100">
              <Shield className="h-4 w-4 mr-1" />
              Solo Distribuidores
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Centro de
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
                {" "}Descargas
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Esta sección requiere autenticación
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-slate-700 hover:bg-slate-800">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100">
            <Shield className="h-4 w-4 mr-1" />
            Solo Distribuidores
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Centro de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}Descargas
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Sección únicamente para distribuidores autorizados
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Descubra más sobre nuestra amplia gama de servicios profesionales. Actualizamos esta página constantemente,
            pero si todavía no encuentra lo que busca, no dude en ponerse en contacto con nosotros,
            estaremos encantados de ayudarle.
          </p>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mt-8">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Descarga
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Descarga</DialogTitle>
                    <DialogDescription>
                      Complete la información de la nueva descarga
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newDownload.title}
                        onChange={(e) => setNewDownload({...newDownload, title: e.target.value})}
                        placeholder="Título de la descarga"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newDownload.description}
                        onChange={(e) => setNewDownload({...newDownload, description: e.target.value})}
                        placeholder="Descripción detallada"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={newDownload.type} onValueChange={(value) => setNewDownload({...newDownload, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beta">Beta</SelectItem>
                          <SelectItem value="Instalador">Instalador</SelectItem>
                          <SelectItem value="Driver">Driver</SelectItem>
                          <SelectItem value="App Móvil">App Móvil</SelectItem>
                          <SelectItem value="Complemento">Complemento</SelectItem>
                          <SelectItem value="Documentación">Documentación</SelectItem>
                          <SelectItem value="Actualización">Actualización</SelectItem>
                          <SelectItem value="Runtime">Runtime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Fecha (opcional)</Label>
                      <Input
                        id="date"
                        value={newDownload.date}
                        onChange={(e) => setNewDownload({...newDownload, date: e.target.value})}
                        placeholder="ej: 15 de noviembre 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fileName">Nombre del archivo</Label>
                      <Input
                        id="fileName"
                        value={newDownload.fileName}
                        onChange={(e) => setNewDownload({...newDownload, fileName: e.target.value})}
                        placeholder="archivo.zip"
                      />
                    </div>
                    <Button onClick={handleAddDownload} className="w-full">
                      Agregar Descarga
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-8 px-4 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Importante para Distribuidores</h3>
              <p className="text-sm">Asegúrese de descargar todos los archivos necesarios para cada actualización, incluyendo archivos .DLL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download, index) => (
              <Card key={download.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-50 rounded-full">
                      {download.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(download.type)}>
                        {download.type}
                      </Badge>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDownload(download)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDownload(download.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-900 line-clamp-2">
                    {download.title}
                  </CardTitle>
                  {download.date && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {download.date}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {download.description}
                  </CardDescription>
                  {(isClient || isAdmin) && (
                    <Button
                      className="w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleDownload(download.fileName, download.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Descarga</DialogTitle>
              <DialogDescription>
                Modifique la información de la descarga
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={newDownload.title}
                  onChange={(e) => setNewDownload({...newDownload, title: e.target.value})}
                  placeholder="Título de la descarga"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={newDownload.description}
                  onChange={(e) => setNewDownload({...newDownload, description: e.target.value})}
                  placeholder="Descripción detallada"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Tipo</Label>
                <Select value={newDownload.type} onValueChange={(value) => setNewDownload({...newDownload, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beta">Beta</SelectItem>
                    <SelectItem value="Instalador">Instalador</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="App Móvil">App Móvil</SelectItem>
                    <SelectItem value="Complemento">Complemento</SelectItem>
                    <SelectItem value="Documentación">Documentación</SelectItem>
                    <SelectItem value="Actualización">Actualización</SelectItem>
                    <SelectItem value="Runtime">Runtime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-date">Fecha (opcional)</Label>
                <Input
                  id="edit-date"
                  value={newDownload.date}
                  onChange={(e) => setNewDownload({...newDownload, date: e.target.value})}
                  placeholder="ej: 15 de noviembre 2024"
                />
              </div>
              <div>
                <Label htmlFor="edit-fileName">Nombre del archivo</Label>
                <Input
                  id="edit-fileName"
                  value={newDownload.fileName}
                  onChange={(e) => setNewDownload({...newDownload, fileName: e.target.value})}
                  placeholder="archivo.zip"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateDownload} className="flex-1">
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

      {/* Support Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿Necesitas Ayuda?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo técnico está disponible para ayudarte con cualquier instalación o actualización
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg text-slate-700">
                Contacto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Descargas;