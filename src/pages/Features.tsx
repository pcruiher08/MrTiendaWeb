
import { CheckCircle, BarChart3, Users, Package, CreditCard, Shield, Smartphone, Cloud, Headphones, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Features = () => {
  const mainFeatures = [
    {
      icon: <CreditCard className="h-8 w-8 text-slate-700" />,
      title: "Control de Ventas",
      description: "Sistema completo de punto de venta con múltiples formas de pago",
      benefits: ["Cobro rápido", "Múltiples formas de pago", "Impresión de tickets", "Cambio automático"]
    },
    {
      icon: <Package className="h-8 w-8 text-slate-700" />,
      title: "Inventario",
      description: "Control total de tu inventario en tiempo real",
      benefits: ["Seguimiento en tiempo real", "Alertas de stock bajo", "Códigos de barras", "Productos ilimitados"]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-slate-700" />,
      title: "Listas de Precios",
      description: "Manejo de múltiples listas de precios personalizadas",
      benefits: ["Precios por cliente", "Promociones automáticas", "Descuentos especiales", "Precios por volumen"]
    },
    {
      icon: <Users className="h-8 w-8 text-slate-700" />,
      title: "Módulo de Clientes",
      description: "Administra tu base de clientes y programas de lealtad",
      benefits: ["Base de datos completa", "Historial de compras", "Puntos acumulados", "Crédito y cobranza"]
    },
    {
      icon: <Shield className="h-8 w-8 text-slate-700" />,
      title: "Facturación CFDI 4.0",
      description: "Facturación electrónica totalmente actualizada",
      benefits: ["CFDI 4.0 completo", "Complementos de pago 2.0", "Timbrado automático", "Cancelaciones"]
    },
    {
      icon: <Smartphone className="h-8 w-8 text-slate-700" />,
      title: "Mr Móvil",
      description: "Accede a tu sistema desde cualquier dispositivo móvil",
      benefits: ["App móvil", "Sincronización automática", "Ventas offline", "Reportes móviles"]
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
            Todo lo que necesitas para
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}hacer crecer tu negocio
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Mr. Tienda incluye todas las herramientas profesionales que necesitas para gestionar 
            tu negocio de manera eficiente y aumentar tus ventas.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="mb-4 p-3 bg-slate-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
