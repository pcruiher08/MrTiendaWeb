
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Shield, Zap, CreditCard, Package, BarChart3, Smartphone, Store, Building, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-slate-700" />,
      title: "Control de Ventas",
      description: "Sistema completo de punto de venta con todas las herramientas necesarias"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-slate-700" />,
      title: "Listas de Precios",
      description: "Manejo de múltiples listas de precios personalizadas por cliente"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-slate-700" />,
      title: "Manejo de Sucursales",
      description: "Administra múltiples sucursales desde una sola plataforma"
    },
    {
      icon: <Users className="h-8 w-8 text-slate-700" />,
      title: "Módulo de Clientes",
      description: "Gestión completa de clientes con historial y programas de lealtad"
    },
    {
      icon: <Package className="h-8 w-8 text-slate-700" />,
      title: "Inventario",
      description: "Control total de inventario en tiempo real con alertas automáticas"
    },
    {
      icon: <Shield className="h-8 w-8 text-slate-700" />,
      title: "Proveedores",
      description: "Administración completa de proveedores y compras"
    },
    {
      icon: <Shield className="h-8 w-8 text-slate-700" />,
      title: "Facturación CFDI 4.0",
      description: "Facturación electrónica totalmente actualizada y legal"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-slate-700" />,
      title: "Mr Móvil",
      description: "Aplicación móvil para gestionar tu negocio desde cualquier lugar"
    }
  ];

  const mainFeatures = [
    {
      title: "Control de ventas",
      items: [
        "Retención de cuentas",
        "Lectura de etiquetas de carnicería",
        "Lectura del peso de la báscula",
        "Cobro de servicios y recargas",
        "Manejo de comisiones",
        "Devoluciones con control de usuarios"
      ]
    },
    {
      title: "Listas ilimitadas de precios",
      items: [
        "Múltiples escalas de precios",
        "Ofertas programadas por períodos",
        "Ofertas por volumen de compra 2x1",
        "Lleva tres y paga 2",
        "Ofertas cruzadas",
        "Manejo de precios por paquetes"
      ]
    },
    {
      title: "Manejo de sucursales",
      items: [
        "Conexión entre sucursales",
        "Envío de altas de productos y cambios de precios",
        "Traspasos entre sucursales",
        "Recolección de ventas",
        "Consulta remota de existencias"
      ]
    },
    {
      title: "Módulo de clientes",
      items: [
        "Precios especiales por cliente",
        "Ventas a crédito y apartados",
        "Abonos y anticipos",
        "Facturación directa y facturación de recibos",
        "Cotizaciones",
        "Cliente frecuente"
      ]
    },
    {
      title: "Inventario",
      items: [
        "Traspaso de mercancía entre sucursales",
        "Manejo de productos matriciados",
        "Consolidar sabores, colores y tallas",
        "Inventario de carnicería y tablajería",
        "Kardex completo"
      ]
    },
    {
      title: "Proveedores",
      items: [
        "Reporte de antigüedad de saldos",
        "Proyección de cobranza",
        "Distribución del saldo deudor en mensualidades",
        "Estados de cuenta",
        "Análisis de precios por proveedor"
      ]
    }
  ];

  const businessTypes = [
    {
      icon: <Store className="h-12 w-12 text-slate-700" />,
      title: "Supermercados y Abarrotes",
      description: "Solución completa para el retail tradicional"
    },
    {
      icon: <Building className="h-12 w-12 text-slate-700" />,
      title: "Ferreterías",
      description: "Gestión especializada para materiales y herramientas"
    },
    {
      icon: <Pill className="h-12 w-12 text-slate-700" />,
      title: "Farmacias",
      description: "Control especializado para medicamentos y productos de salud"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  ¡El Primer
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
                    {" "}Punto de Venta
                  </span>
                  {" "}Inteligente!
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="mb-3">
                        <CreditCard className="h-8 w-8 mx-auto text-white/80 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="font-bold text-base sm:text-lg lg:text-xl mb-3 leading-tight">facturación electrónica y complementos de pago</div>
                      <div className="text-xs sm:text-sm bg-white/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm border border-white/20 font-medium">CFDI 4.0</div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="mb-3">
                        <TrendingUp className="h-8 w-8 mx-auto text-white/80 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="font-bold text-base sm:text-lg lg:text-xl mb-3 leading-tight">manejo de sucursales</div>
                      <div className="text-xs sm:text-sm bg-white/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm border border-white/20 font-medium">Múltiples ubicaciones</div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/10 sm:col-span-2 md:col-span-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="mb-3">
                        <Smartphone className="h-8 w-8 mx-auto text-white/80 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="font-bold text-base sm:text-lg lg:text-xl mb-3 leading-tight">terminales android para meseros</div>
                      <div className="text-xs sm:text-sm bg-white/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm border border-white/20 font-medium">Mr Móvil</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/contacto" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white px-6 sm:px-8 py-3 text-base sm:text-lg transition-colors">
                    Contactar
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/distribuidores" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white transition-colors">
                    Encontrar Distribuidor
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">25 años de experiencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">Soporte especializado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">CFDI 4.0</span>
                </div>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-gray-600/20 rounded-3xl blur-3xl"></div>
              <img 
                src="/images/mrtiendahero.jpg"
                alt="Mr. Tienda POS System"
                className="relative z-10 w-full max-w-md lg:max-w-lg h-auto rounded-2xl shadow-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu punto de venta
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Mr. Tienda integra todas las herramientas esenciales para la gestión completa de tu negocio
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-slate-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
              CARACTERÍSTICAS MRTIENDA
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
              Descubra más sobre nuestra amplia gama de servicios profesionales. Actualizamos esta página constantemente, 
              pero si todavía no encuentra lo que busca, no dude en ponerse en contacto con nosotros, estaremos encantados de ayudarle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mr Móvil Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Con <span className="text-slate-700">MrMóvil</span> revoluciona tu servicio
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Puedes utilizar a tus meseros desde cualquier dispositivo Android para levantar órdenes en la mesa, 
                mandando directamente a las impresoras de cocina y bares.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                Una solución completa que moderniza la operación de restaurantes y establecimientos de servicio.
              </p>
            </div>
            
            <div className="relative order-1 md:order-2 mb-6 md:mb-0">
              <img 
                src="/images/mrmovilapp.jpg"
                alt="Mr Móvil App"
                className="w-full max-w-sm md:max-w-md h-auto rounded-xl shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-slate-100 to-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
              Soluciones para Diferentes Tipos de Negocio
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              Mr. Tienda se adapta perfectamente a las necesidades específicas de tu industria
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {businessTypes.map((business, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md h-full">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 p-3 sm:p-4 bg-slate-50 rounded-full w-fit">
                    {business.icon}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 px-2">{business.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 text-base sm:text-lg px-2">
                    {business.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4">
            ¿Listo para modernizar tu negocio?
          </h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 opacity-90 px-4">
            Únete a miles de empresarios que ya revolucionaron sus ventas con Mr. Tienda
          </p>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-80 px-4">
            Consulte la sección de Distribuidores para ubicar al más cercano.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to="/contacto" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg bg-white text-slate-800 hover:bg-gray-100 transition-colors">
                Contactar
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to="/distribuidores" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg bg-white text-slate-800 hover:bg-gray-100 transition-colors">
                Encontrar Distribuidor
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
