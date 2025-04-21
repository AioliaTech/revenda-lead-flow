
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold text-crm-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          Desculpe, a página que você está tentando acessar não existe ou foi removida.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-crm-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
