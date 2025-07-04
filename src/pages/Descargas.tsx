import { Download, FileText, Shield, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Descargas = () => {
  const downloads = [
    {
      title: "Versión Beta 3 de junio 2025 Incluye Mrtimbre",
      description: "Es muy importante descargar todos los archivos de este beta para actualizar. (incluyendo los archivos: .DLL) Resuelto el detalle de redondeo de los decimales en la factura.",
      date: "3 de junio 2025",
      type: "Beta",
      icon: <FileText className="h-6 w-6" />,
      fileName: "beta-mrtienda-junio-2025.zip"
    },
    {
      title: "Cambios en la versión Beta 3 de junio 2025",
      description: "SE CORRIGIÓ EL PROBLEMA DE LAS LLAVES VIRTUALES AL CAMBIAR VERSIÓN DE WINDOWS. SE CORRIGIO EL PROBLEMA DE LA DIFERENCIA DE LOS DECIMALES AL FACTURAR. SE ACTUALIZÓ EL EASYONE.DLL",
      date: "3 de junio 2025",
      type: "Documentación",
      icon: <FileText className="h-6 w-6" />,
      fileName: "cambios-beta-junio-2025.pdf"
    },
    {
      title: "Instalador Mrtienda y Mrtienda Básico",
      description: "Versión necesaria para utilizar \"La Nube\".",
      date: "15 de noviembre 2024",
      type: "Instalador",
      icon: <Download className="h-6 w-6" />,
      fileName: "instalador-mrtienda-basico.exe"
    },
    {
      title: "Instalador Mrtimbre",
      description: "Instalador oficial del módulo de timbrado.",
      date: "22 de julio",
      type: "Instalador",
      icon: <Download className="h-6 w-6" />,
      fileName: "instalador-mrtimbre.exe"
    },
    {
      title: "Runtime de Visual Studio",
      description: "Componentes necesarios para el funcionamiento del sistema.",
      date: "",
      type: "Runtime",
      icon: <Download className="h-6 w-6" />,
      fileName: "runtime-visual-studio.exe"
    },
    {
      title: "Driver Microdog Windows 10",
      description: "Driver para dispositivos de protección en Windows 10.",
      date: "",
      type: "Driver",
      icon: <Download className="h-6 w-6" />,
      fileName: "driver-microdog-win10.exe"
    },
    {
      title: "Driver lector huella digital RTE.ZIP",
      description: "Driver para lectores de huella digital compatibles.",
      date: "",
      type: "Driver",
      icon: <Download className="h-6 w-6" />,
      fileName: "driver-huella-digital-rte.zip"
    },
    {
      title: "MrMovil / Instalador",
      description: "Aplicación móvil para el manejo del sistema.",
      date: "",
      type: "App Móvil",
      icon: <Download className="h-6 w-6" />,
      fileName: "mrmovil-instalador.apk"
    },
    {
      title: "MrMovil nuevo ejecutable",
      description: "Después de instalar el módulo con el instalador, reemplazar el EXE del instalador por este.",
      date: "19 de julio de 2024",
      type: "Actualización",
      icon: <Download className="h-6 w-6" />,
      fileName: "mrmovil-ejecutable-nuevo.exe"
    },
    {
      title: "Complemento Carta Porte 3.1",
      description: "Nueva librería para soportar esta versión.",
      date: "",
      type: "Complemento",
      icon: <Download className="h-6 w-6" />,
      fileName: "complemento-carta-porte-31.dll"
    },
    {
      title: "mrRPM Instalador",
      description: "Instalador del módulo de recarga de productos y servicios.",
      date: "",
      type: "Instalador",
      icon: <Download className="h-6 w-6" />,
      fileName: "mrrpm-instalador.exe"
    }
  ];

  const handleDownload = (fileName: string, title: string) => {
    // Create download link for file from public/downloads directory
    const link = document.createElement('a');
    link.href = `/downloads/${fileName}`;
    link.download = fileName;
    link.click();
    
    // Log the download for analytics if needed
    console.log(`Downloaded: ${title} - ${fileName}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Beta": return "bg-orange-100 text-orange-700";
      case "Instalador": return "bg-slate-100 text-slate-7700";
      case "Driver": return "bg-green-100 text-green-700";
      case "App Móvil": return "bg-purple-100 text-purple-700";
      case "Complemento": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
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
            Centro de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}Descargas
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Sección únicamente para distribuidores
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Descubra más sobre nuestra amplia gama de servicios profesionales. Actualizamos esta página constantemente, 
            pero si todavía no encuentra lo que busca, no dude en ponerse en contacto con nosotros, 
            estaremos encantados de ayudarle.
          </p>
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
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-50 rounded-full">
                      {download.icon}
                    </div>
                    <Badge className={getTypeColor(download.type)}>
                      {download.type}
                    </Badge>
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
                  <Button 
                    className="w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleDownload(download.fileName, download.title)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
