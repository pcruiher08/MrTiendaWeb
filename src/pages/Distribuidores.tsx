
import { MapPin, Phone, Mail, Users, Award, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Distribuidores = () => {
  const distributors = [
    {
      name: "TechPOS Baja California",
      city: "Ensenada",
      contact: "Juan Carlos López",
      phone: "+52 (646) 123-4567",
      email: "jlopez@techpos.mx",
      experience: "8 años"
    },
    {
      name: "Soluciones Comerciales GDL",
      city: "Guadalajara",
      contact: "María Elena Rodríguez",
      phone: "+52 (33) 2345-6789",
      email: "mrodriguez@solcom.mx",
      experience: "12 años"
    },
    {
      name: "Sistemas Norte",
      city: "Monterrey",
      contact: "Roberto Martínez",
      phone: "+52 (81) 3456-7890",
      email: "rmartinez@sisnorte.mx",
      experience: "15 años"
    },
    {
      name: "POS Solutions Bajío",
      city: "León",
      contact: "Ana Patricia Herrera",
      phone: "+52 (477) 456-7891",
      email: "aherrera@posbajio.mx",
      experience: "6 años"
    },
    {
      name: "Tecnología Comercial Sur",
      city: "Mérida",
      contact: "Carlos Alberto Pérez",
      phone: "+52 (999) 567-8912",
      email: "cperez@tecsur.mx",
      experience: "10 años"
    },
    {
      name: "Sistemas Pacífico",
      city: "Tijuana",
      contact: "Laura Fernández",
      phone: "+52 (664) 678-9123",
      email: "lfernandez@sispacifico.mx",
      experience: "9 años"
    }
  ];

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
              <div className="text-4xl font-bold text-slate-700">30+</div>
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
              Contamos con distribuidores especializados en todo el país
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {distributors.map((distributor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <Users className="h-5 w-5 text-slate-700" />
                    </div>
                    <Badge variant="secondary">{distributor.experience}</Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{distributor.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {distributor.contact}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-slate-700 flex-shrink-0" />
                    <span className="text-gray-700">{distributor.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-700 flex-shrink-0" />
                    <span className="text-gray-700">{distributor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-700 flex-shrink-0" />
                    <span className="text-gray-700">{distributor.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
