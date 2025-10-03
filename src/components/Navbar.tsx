
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Características", path: "/caracteristicas" },
    { name: "Contacto", path: "/contacto" },
    { name: "Distribuidores", path: "/distribuidores" },
    { name: "Descargas", path: "/descargas" },
    { name: "Boletines", path: "/boletines" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-slate-700" />
            <span className="text-2xl font-bold text-gray-900">Mr. Tienda</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? "text-slate-700"
                    : "text-gray-600 hover:text-slate-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-gray-700">{user?.name}</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600 capitalize">
                    {user?.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-slate-700 hover:bg-slate-800">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-slate-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? "text-slate-700 bg-slate-50"
                    : "text-gray-600 hover:text-slate-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 mt-3 pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="text-gray-700 text-sm">{user?.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-600 hover:text-slate-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
