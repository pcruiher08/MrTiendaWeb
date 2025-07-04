
import { CheckCircle, Zap, Shield, Users, BarChart3, CreditCard, Package, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Caracteristicas = () => {
  const features = [
    "100% amigable para el usuario",
    "Manejo de lectoras de barras, cajón de dinero, miniprinters, básculas, colectores de datos",
    "Acepta múltiples formas de pago",
    "Manejo de monedas extranjeras para pagos y cambios",
    "Despliega el precio del artículo, basado en el tipo de cliente, tipo de venta, o promoción que se encuentre vigente",
    "Sistema de puntos acumulados",
    "Sistema de recibo premiado",
    "Observaciones Inteligentes",
    "Manejo de cuentas pendientes",
    "Lectura de etiquetas de carnicería por códigos de barras",
    "Completa administración del servicio a domicilio",
    "Cobro de servicios como agua, luz, teléfono, etc.",
    "Manejo y asignación de vendedores en forma coordinada con los cajeros",
    "Manejo de vales y retiros de dinero",
    "Pago a proveedores",
    "Deposito de envases",
    "Devoluciones, anulaciones y Cancelación de cuentas",
    "Impresión de recibos muy claros que resaltan el ahorro del cliente en la compra",
    "Impresión de logotipos gráficos en el recibo del cliente",
    "Configuración de recibos en cualquier idioma",
    "Cortes por cajero, corte departamental, corte por vendedor",
    "Cortes X y cortes Z",
    "Acceso a consultar cortes históricos en cualquier momento desde la caja"
  ];

  const categories = [
    {
      title: "Interfaz y Usabilidad",
      icon: <Users className="h-8 w-8 text-slate-700" />,
      features: [
        "100% amigable para el usuario",
        "Configuración de recibos en cualquier idioma",
        "Observaciones Inteligentes"
      ]
    },
    {
      title: "Hardware Compatible",
      icon: <Package className="h-8 w-8 text-slate-700" />,
      features: [
        "Manejo de lectoras de barras, cajón de dinero, miniprinters, básculas, colectores de datos",
        "Lectura de etiquetas de carnicería por códigos de barras"
      ]
    },
    {
      title: "Formas de Pago",
      icon: <CreditCard className="h-8 w-8 text-slate-700" />,
      features: [
        "Acepta múltiples formas de pago",
        "Manejo de monedas extranjeras para pagos y cambios",
        "Manejo de vales y retiros de dinero"
      ]
    },
    {
      title: "Precios y Promociones",
      icon: <BarChart3 className="h-8 w-8 text-slate-700" />,
      features: [
        "Despliega el precio del artículo, basado en el tipo de cliente, tipo de venta, o promoción que se encuentre vigente",
        "Sistema de puntos acumulados",
        "Sistema de recibo premiado"
      ]
    },
    {
      title: "Gestión Comercial",
      icon: <Globe className="h-8 w-8 text-slate-700" />,
      features: [
        "Manejo de cuentas pendientes",
        "Completa administración del servicio a domicilio",
        "Cobro de servicios como agua, luz, teléfono, etc.",
        "Manejo y asignación de vendedores en forma coordinada con los cajeros",
        "Pago a proveedores",
        "Deposito de envases"
      ]
    },
    {
      title: "Reportes y Control",
      icon: <Shield className="h-8 w-8 text-slate-700" />,
      features: [
        "Cortes por cajero, corte departamental, corte por vendedor",
        "Cortes X y cortes Z",
        "Acceso a consultar cortes históricos en cualquier momento desde la caja",
        "Devoluciones, anulaciones y Cancelación de cuentas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-7700 hover:bg-slate-100">
            Características Completas
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Características
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}MrTienda
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Sistema de punto de venta completo con todas las herramientas que necesitas 
            para gestionar tu negocio de manera profesional y eficiente.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades por Categoría
            </h2>
            <p className="text-xl text-gray-600">
              Organizadas por tipo de funcionalidad para una mejor comprensión
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-full">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Features List */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lista Completa de Características
            </h2>
            <p className="text-xl text-gray-600">
              Todas las funcionalidades disponibles en MrTienda
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para modernizar tu negocio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre cómo MrTienda puede transformar la gestión de tu punto de venta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto">
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

export default Caracteristicas;
