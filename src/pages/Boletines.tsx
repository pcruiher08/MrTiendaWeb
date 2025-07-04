import { FileText, Download, Shield, Search, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Boletines = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const bulletins = [
    "Boletines (TODOS)",
    "Antibióticos",
    "Anticipos, Facturación",
    "Auditoria de tasas de IVA e IEPS en la factura Global",
    "Buscador de Productos y Servicios en Mrtienda",
    "Características Mrtienda 5.2",
    "Características Mrtienda Básico",
    "Cobro de cuentas pendientes con retencion del 1.25 de ISR",
    "Colector de datos en tabletas Windows",
    "Complemento Carta Porte",
    "Configuración del código de barras en el recibo",
    "Configuración de pagos de SERVICIOS y REGARGAS RPM",
    "Configuracion de Básculas nuevo",
    "Configuración de correos por Infinitummail, Gmail y Hotmail",
    "Costos",
    "Combos",
    "Componente INE",
    "Etiqueta de Carnicería",
    "Exportación e importación de inventario a un nuevo catalogo",
    "Eventos de produccion",
    "Facturación de recibos de crédito",
    "Forma de pago en parcialidades",
    "FTP nuevo metodo de envío",
    "Herramienta para evitar malos manejos en cuentas pendientes",
    "Importación de XML para el llenado de la Carta Porte",
    "Importación de catálogos de Excel",
    "Impresores bajo el driver Windows. Guía de configuración",
    "Impresores puerto paralelo y serial. Guía de configuración",
    "Kardex",
    "Kardex guardar al realizar el corte para agilizar las cajas",
    "Lector de huella DigitalPersona U.are.U 4500",
    "Logotipo en el recibo de venta",
    "MECANISMO DE AUDITORIA DE CUENTAS ABIERTAS VS CUENTAS PAGADAS",
    "Membrecías de gimnasio",
    "Método de terminal modalidad PANADERIA",
    "Modalidad VALES MONETARIOS",
    "Modalidad preguntar el NUMERO DE MESA al INICIA DE OPERACIONES",
    "Monitoreo de cajas de cobro",
    "Monitoreo de recibos",
    "Mrmovil Guía",
    "MrTienda BÁSICO instalación activación de licencia",
    "MrTienda modalidad restaurante",
    "Mrtimbre guía de instalacion",
    "Múltiples presentaciones en elaboración de recetas",
    "Menu Principal configuración",
    "Montos de pago predefinidos",
    "Menú principal. Configuración",
    "Observaciones Inteligentes",
    "Ofertas 2 x 1 de productos diferentes",
    "Ofertas cruzadas y ofertas 2 x 1",
    "Ofertas el segundo árticulo a mitad de precio",
    "Pantalla de producción",
    "Pago de comisiones",
    "Propina sugerida",
    "Puntos Aplicación por productos",
    "Puntos",
    "Recetas",
    "Reloj checador",
    "Reporte de platillos servidos vs cobrados",
    "Reporte de productos no vendidos por periodo",
    "Reporte de ventas rápido",
    "Retención del 1.25 IEPS",
    "Servicio a domicilio",
    "Tablajería",
    "Terminal Bancaria"
  ];

  const filteredBulletins = bulletins.filter(bulletin =>
    bulletin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (bulletinName: string) => {
    // Convert bulletin name to filename format
    const fileName = bulletinName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .concat('.pdf');
    
    // Create download link for PDF from public/pdfs directory
    const link = document.createElement('a');
    link.href = `/pdfs/${fileName}`;
    link.download = fileName;
    link.click();
    
    // Log the download for analytics if needed
    console.log(`Downloaded PDF: ${bulletinName} - ${fileName}`);
  };

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
            Sección únicamente para distribuidores
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Descarga los boletines y guías para ayudarte a configurar los diferentes módulos de Mrtienda.
          </p>
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
            {filteredBulletins.map((bulletin, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium text-gray-900 line-clamp-2">
                        {bulletin}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 mt-1">
                        Guía PDF
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-blue-700 hover:to-purple-700 text-xs"
                    onClick={() => handleDownloadPDF(bulletin)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Descargar PDF
                  </Button>
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
