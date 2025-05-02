
import React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const BeginnersGuide = () => {
  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-md animate-fade-in overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-md">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-yellow-800 mb-1">Dica para iniciantes</h3>
            <p className="text-sm text-yellow-700 leading-relaxed">
              Aqui você pode personalizar as informações da sua loja. Cada seção abaixo controla 
              uma parte diferente do site. Depois de fazer as alterações, clique em "Salvar Configurações"
              no final da página.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeginnersGuide;
