
import React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const BeginnersGuide = () => {
  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-2">
          <div className="p-2 bg-yellow-100 rounded-full">
            <MessageSquare className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-yellow-800">Dica para iniciantes</h3>
            <p className="text-sm text-yellow-700">
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
