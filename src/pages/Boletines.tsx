import { FileText, Download, Shield, Search, Users, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface BulletinItem {
  id: string;
  title: string;
  fileName: string;
}

const Boletines = () => {
  const { isAuthenticated, isClient, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BulletinItem | null>(null);
  const [newBulletin, setNewBulletin] = useState({
    title: '',
    fileName: ''
  });

  const [bulletins, setBulletins] = useState<BulletinItem[]>([
    { id: '1', title: "Boletines (TODOS)", fileName: "boletines-todos.pdf" },
    { id: '2', title: "Antibióticos", fileName: "antibiotics.pdf" },
    { id: '3', title: "Anticipos, Facturación", fileName: "anticipos-facturacion.pdf" },
    { id: '4', title: "Auditoria de tasas de IVA e IEPS en la factura Global", fileName: "auditoria-iva-ieps.pdf" },
    { id: '5', title: "Buscador de Productos y Servicios en Mrtienda", fileName: "buscador-productos.pdf" },
    { id: '6', title: "Características Mrtienda 5.2", fileName: "caracteristicas-mrtienda-52.pdf" },
    { id: '7', title: "Características Mrtienda Básico", fileName: "caracteristicas-basico.pdf" },
    { id: '8', title: "Cobro de cuentas pendientes con retencion del 1.25 de ISR", fileName: "cobro-cuentas-pendientes.pdf" },
    { id: '9', title: "Colector de datos en tabletas Windows", fileName: "colector-datos-tabletas.pdf" },
    { id: '10', title: "Complemento Carta Porte", fileName: "complemento-carta-porte.pdf" },
    { id: '11', title: "Configuración del código de barras en el recibo", fileName: "configuracion-codigo-barras.pdf" },
    { id: '12', title: "Configuración de pagos de SERVICIOS y REGARGAS RPM", fileName: "configuracion-pagos-servicios.pdf" },
    { id: '13', title: "Configuracion de Básculas nuevo", fileName: "configuracion-basculas.pdf" },
    { id: '14', title: "Configuración de correos por Infinitummail, Gmail y Hotmail", fileName: "configuracion-correos.pdf" },
    { id: '15', title: "Costos", fileName: "costos.pdf" },
    { id: '16', title: "Combos", fileName: "combos.pdf" },
    { id: '17', title: "Componente INE", fileName: "componente-ine.pdf" },
    { id: '18', title: "Etiqueta de Carnicería", fileName: "etiqueta-carniceria.pdf" },
    { id: '19', title: "Exportación e importación de inventario a un nuevo catalogo", fileName: "exportacion-importacion-inventario.pdf" },
    { id: '20', title: "Eventos de produccion", fileName: "eventos-produccion.pdf" },
    { id: '21', title: "Facturación de recibos de crédito", fileName: "facturacion-recibos-credito.pdf" },
    { id: '22', title: "Forma de pago en parcialidades", fileName: "forma-pago-parcialidades.pdf" },
    { id: '23', title: "FTP nuevo metodo de envío", fileName: "ftp-nuevo-metodo.pdf" },
    { id: '24', title: "Herramienta para evitar malos manejos en cuentas pendientes", fileName: "herramienta-malos-manejos.pdf" },
    { id: '25', title: "Importación de XML para el llenado de la Carta Porte", fileName: "importacion-xml-carta-porte.pdf" },
    { id: '26', title: "Importación de catálogos de Excel", fileName: "importacion-catalogos-excel.pdf" },
    { id: '27', title: "Impresores bajo el driver Windows. Guía de configuración", fileName: "impresores-driver-windows.pdf" },
    { id: '28', title: "Impresores puerto paralelo y serial. Guía de configuración", fileName: "impresores-puerto-paralelo.pdf" },
    { id: '29', title: "Kardex", fileName: "kardex.pdf" },
    { id: '30', title: "Kardex guardar al realizar el corte para agilizar las cajas", fileName: "kardex-guardar-corte.pdf" },
    { id: '31', title: "Lector de huella DigitalPersona U.are.U 4500", fileName: "lector-huella-digitalpersona.pdf" },
    { id: '32', title: "Logotipo en el recibo de venta", fileName: "logotipo-recibo.pdf" },
    { id: '33', title: "MECANISMO DE AUDITORIA DE CUENTAS ABIERTAS VS CUENTAS PAGADAS", fileName: "mecanismo-auditoria-cuentas.pdf" },
    { id: '34', title: "Membrecías de gimnasio", fileName: "membresias-gimnasio.pdf" },
    { id: '35', title: "Método de terminal modalidad PANADERIA", fileName: "metodo-terminal-panaderia.pdf" },
    { id: '36', title: "Modalidad VALES MONETARIOS", fileName: "modalidad-vales-monetarios.pdf" },
    { id: '37', title: "Modalidad preguntar el NUMERO DE MESA al INICIA DE OPERACIONES", fileName: "modalidad-numero-mesa.pdf" },
    { id: '38', title: "Monitoreo de cajas de cobro", fileName: "monitoreo-cajas-cobro.pdf" },
    { id: '39', title: "Monitoreo de recibos", fileName: "monitoreo-recibos.pdf" },
    { id: '40', title: "Mrmovil Guía", fileName: "mrmovil-guia.pdf" },
    { id: '41', title: "MrTienda BÁSICO instalación activación de licencia", fileName: "mrtienda-basico-instalacion.pdf" },
    { id: '42', title: "MrTienda modalidad restaurante", fileName: "mrtienda-modalidad-restaurante.pdf" },
    { id: '43', title: "Mrtimbre guía de instalacion", fileName: "mrtimbre-guia-instalacion.pdf" },
    { id: '44', title: "Múltiples presentaciones en elaboración de recetas", fileName: "multiples-presentaciones-recetas.pdf" },
    { id: '45', title: "Menu Principal configuración", fileName: "menu-principal-configuracion.pdf" },
    { id: '46', title: "Montos de pago predefinidos", fileName: "montos-pago-predefinidos.pdf" },
    { id: '47', title: "Menú principal. Configuración", fileName: "menu-principal-configuracion-2.pdf" },
    { id: '48', title: "Observaciones Inteligentes", fileName: "observaciones-inteligentes.pdf" },
    { id: '49', title: "Ofertas 2 x 1 de productos diferentes", fileName: "ofertas-2x1-diferentes.pdf" },
    { id: '50', title: "Ofertas cruzadas y ofertas 2 x 1", fileName: "ofertas-cruzadas.pdf" },
    { id: '51', title: "Ofertas el segundo árticulo a mitad de precio", fileName: "ofertas-segundo-mitad.pdf" },
    { id: '52', title: "Pantalla de producción", fileName: "pantalla-produccion.pdf" },
    { id: '53', title: "Pago de comisiones", fileName: "pago-comisiones.pdf" },
    { id: '54', title: "Propina sugerida", fileName: "propina-sugerida.pdf" },
    { id: '55', title: "Puntos Aplicación por productos", fileName: "puntos-aplicacion-productos.pdf" },
    { id: '56', title: "Puntos", fileName: "puntos.pdf" },
    { id: '57', title: "Recetas", fileName: "recetas.pdf" },
    { id: '58', title: "Reloj checador", fileName: "reloj-checador.pdf" },
    { id: '59', title: "Reporte de platillos servidos vs cobrados", fileName: "reporte-platillos-servidos.pdf" },
    { id: '60', title: "Reporte de productos no vendidos por periodo", fileName: "reporte-productos-no-vendidos.pdf" },
    { id: '61', title: "Reporte de ventas rápido", fileName: "reporte-ventas-rapido.pdf" },
    { id: '62', title: "Retención del 1.25 IEPS", fileName: "retencion-ieps.pdf" },
    { id: '63', title: "Servicio a domicilio", fileName: "servicio-domicilio.pdf" },
    { id: '64', title: "Tablajería", fileName: "tablajeria.pdf" },
    { id: '65', title: "Terminal Bancaria", fileName: "terminal-bancaria.pdf" }
  ]);

  const filteredBulletins = bulletins.filter(bulletin =>
    bulletin.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (bulletin: BulletinItem) => {
    // Create download link for PDF from public/pdfs directory
    const link = document.createElement('a');
    link.href = `/pdfs/${bulletin.fileName}`;
    link.download = bulletin.fileName;
    link.click();

    // Log the download for analytics if needed
    console.log(`Downloaded PDF: ${bulletin.title} - ${bulletin.fileName}`);
  };

  const handleAddBulletin = () => {
    if (!newBulletin.title || !newBulletin.fileName) {
      return;
    }

    const bulletin: BulletinItem = {
      id: Date.now().toString(),
      title: newBulletin.title,
      fileName: newBulletin.fileName
    };

    setBulletins([...bulletins, bulletin]);
    setNewBulletin({ title: '', fileName: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditBulletin = (bulletin: BulletinItem) => {
    setEditingItem(bulletin);
    setNewBulletin({
      title: bulletin.title,
      fileName: bulletin.fileName
    });
  };

  const handleUpdateBulletin = () => {
    if (!editingItem || !newBulletin.title || !newBulletin.fileName) {
      return;
    }

    setBulletins(bulletins.map(b =>
      b.id === editingItem.id
        ? {
            ...b,
            title: newBulletin.title,
            fileName: newBulletin.fileName
          }
        : b
    ));

    setEditingItem(null);
    setNewBulletin({ title: '', fileName: '' });
  };

  const handleDeleteBulletin = (id: string) => {
    setBulletins(bulletins.filter(b => b.id !== id));
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
              Boletines y
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
                {" "}Guías Técnicas
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
            Boletines y
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}Guías Técnicas
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Sección únicamente para distribuidores autorizados
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Descarga los boletines y guías para ayudarte a configurar los diferentes módulos de Mrtienda.
          </p>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mt-8">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Boletín
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Boletín</DialogTitle>
                    <DialogDescription>
                      Complete la información del nuevo boletín
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título del Boletín</Label>
                      <Input
                        id="title"
                        value={newBulletin.title}
                        onChange={(e) => setNewBulletin({...newBulletin, title: e.target.value})}
                        placeholder="Título del boletín"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fileName">Nombre del archivo PDF</Label>
                      <Input
                        id="fileName"
                        value={newBulletin.fileName}
                        onChange={(e) => setNewBulletin({...newBulletin, fileName: e.target.value})}
                        placeholder="archivo.pdf"
                      />
                    </div>
                    <Button onClick={handleAddBulletin} className="w-full">
                      Agregar Boletín
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 px-4 bg-gradient-to-r from-slate-50 to-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 justify-center text-center">
        <div className="flex items-center justify-center gap-3">
          <FileText className="h-8 w-8 text-slate-700" />
          <div>
            <div className="text-2xl font-bold text-gray-900">{bulletins.length}</div>
            <div className="text-gray-600">Guías Disponibles</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Download className="h-8 w-8 text-slate-700" />
          <div>
            <div className="text-2xl font-bold text-gray-900">10K+</div>
            <div className="text-gray-600">Descargas</div>
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar boletines y guías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {filteredBulletins.length} de {bulletins.length} boletines encontrados
          </p>
        </div>
      </section>

      {/* Bulletins Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBulletins.map((bulletin) => (
              <Card key={bulletin.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium text-gray-900 line-clamp-2">
                        {bulletin.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 mt-1">
                        Guía PDF
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBulletin(bulletin)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBulletin(bulletin.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {(isClient || isAdmin) && (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-blue-700 hover:to-purple-700 text-xs"
                      onClick={() => handleDownloadPDF(bulletin)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Descargar PDF
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBulletins.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron boletines</h3>
              <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Boletín</DialogTitle>
              <DialogDescription>
                Modifique la información del boletín
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título del Boletín</Label>
                <Input
                  id="edit-title"
                  value={newBulletin.title}
                  onChange={(e) => setNewBulletin({...newBulletin, title: e.target.value})}
                  placeholder="Título del boletín"
                />
              </div>
              <div>
                <Label htmlFor="edit-fileName">Nombre del archivo PDF</Label>
                <Input
                  id="edit-fileName"
                  value={newBulletin.fileName}
                  onChange={(e) => setNewBulletin({...newBulletin, fileName: e.target.value})}
                  placeholder="archivo.pdf"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateBulletin} className="flex-1">
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

      {/* Help Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo de soporte está disponible para ayudarte con cualquier configuración específica
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg bg-white text-slate-800 hover:bg-gray-100 transition-colors">
                Contactar
              </Button>
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Boletines;
