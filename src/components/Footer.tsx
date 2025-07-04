
import { Link } from "react-router-dom";
import { ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-slate-400" />
              <span className="text-2xl font-bold text-white">Mr. Tienda</span>
            </div>
            <p className="text-gray-400">
              El sistema POS más completo y fácil de usar para potenciar tu negocio. 
              Confiado por miles de empresarios en México.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-slate-400 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-slate-400 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-slate-400 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-slate-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navegación</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-slate-400 transition-colors">Inicio</Link></li>
              <li><Link to="/caracteristicas" className="hover:text-slate-400 transition-colors">Características</Link></li>
              <li><Link to="/features" className="hover:text-slate-400 transition-colors">Funcionalidades</Link></li>
              <li><Link to="/distribuidores" className="hover:text-slate-400 transition-colors">Distribuidores</Link></li>
              <li><Link to="/contact" className="hover:text-slate-400 transition-colors">Contacto</Link></li>
              <li><Link to="/descargas" className="hover:text-slate-400 transition-colors">Descargas</Link></li>
              <li><Link to="/boletines" className="hover:text-slate-400 transition-colors">Boletines</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <span>info@mrtienda.com.mx</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <span>+52 (646) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span>Ensenada, Baja California, México</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Mr. Tienda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
