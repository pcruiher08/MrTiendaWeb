import React from 'react';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mr. Tienda</h1>
          <p className="text-gray-600">Sistema de Gestión Empresarial</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;