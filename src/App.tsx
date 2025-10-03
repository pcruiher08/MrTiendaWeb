
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Distribuidores from "./pages/Distribuidores";
import Descargas from "./pages/Descargas";
import Boletines from "./pages/Boletines";
import Caracteristicas from "./pages/Caracteristicas";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/distribuidores" element={<Distribuidores />} />
            <Route path="/descargas" element={<Descargas />} />
            <Route path="/boletines" element={<Boletines />} />
            <Route path="/caracteristicas" element={<Caracteristicas />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
