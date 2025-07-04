
import { Mail, Phone, MapPin, Clock, Send, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8 text-slate-700" />,
      title: "Teléfono",
      description: "Habla directamente con nuestro equipo",
      contact: "+52 (646) 123-4567",
      availability: "Lunes a Viernes 9:00 - 18:00"
    },
    {
      icon: <Mail className="h-8 w-8 text-slate-700" />,
      title: "Email",
      description: "Envíanos un mensaje y te respondemos en 24 horas",
      contact: "info@mrtienda.com.mx",
      availability: "Respuesta en 24 horas"
    },
    {
      icon: <Headphones className="h-8 w-8 text-slate-700" />,
      title: "Soporte Técnico",
      description: "Ayuda especializada para problemas técnicos",
      contact: "soporte@mrtienda.com.mx",
      availability: "Disponible para clientes Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            Estamos Aquí para Ayudarte
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Contáctanos y resolvamos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-800">
              {" "}tus dudas juntos
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Nuestro equipo de expertos está listo para ayudarte a encontrar la mejor solución 
            para tu negocio. Contáctanos por el medio que prefieras.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Múltiples Formas de Contactarnos
            </h2>
            <p className="text-xl text-gray-600">
              Elige la opción que más te convenga
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-slate-50 rounded-full w-fit">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">{method.contact}</p>
                    <p className="text-sm text-gray-600">{method.availability}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h2>
              <p className="text-gray-600 mb-8">
                Completa el formulario y nuestro equipo se pondrá en contacto contigo 
                en menos de 24 horas.
              </p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input id="firstName" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input id="lastName" placeholder="Tu apellido" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+52 (646) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" placeholder="Nombre de tu empresa" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un asunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="support">Soporte Técnico</SelectItem>
                      <SelectItem value="billing">Facturación</SelectItem>
                      <SelectItem value="partnership">Alianzas</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    rows={4}
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white py-3">
                  Enviar Mensaje
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-slate-700 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Dirección Principal</h4>
                      <p className="text-gray-600">Av. Ruiz 456, Centro</p>
                      <p className="text-gray-600">Ensenada, Baja California, México</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-slate-700 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Teléfono</h4>
                      <p className="text-gray-600">+52 (646) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-slate-700 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@mrtienda.com.mx</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-slate-700 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Horarios</h4>
                      <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                      <p className="text-gray-600">Sábados: 10:00 - 14:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            No esperes más. Contacta con nosotros y descubre cómo podemos ayudarte.
          </p>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
