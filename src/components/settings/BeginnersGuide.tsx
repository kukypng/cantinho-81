
import React from "react";
import { MessageSquare, HelpCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

/**
 * Componente BeginnersGuide - Exibe dicas úteis para iniciantes na tela de configurações
 * 
 * Este componente fornece orientações básicas para usuários iniciantes
 * sobre como usar o painel de configurações.
 */
const BeginnersGuide = () => {
  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-md animate-fade-in overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-md">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Guia para iniciantes</h3>
              <p className="text-sm text-yellow-700 leading-relaxed">
                Aqui você pode personalizar as informações da sua loja. Cada seção abaixo controla 
                uma parte diferente do site. Depois de fazer as alterações, clique em "Salvar Configurações"
                no final da página.
              </p>
            </div>
            
            <div className="bg-white/50 p-3 rounded-lg border border-yellow-200 flex items-start space-x-2">
              <HelpCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>Dica:</strong> Passe o mouse sobre os ícones de ajuda <HelpCircle className="h-3 w-3 inline text-yellow-600" /> 
                ao lado de cada campo para obter explicações sobre o que cada configuração faz.
              </p>
            </div>
            
            <div className="bg-white/50 p-3 rounded-lg border border-yellow-200 flex items-start space-x-2">
              <FileText className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>Sabia que:</strong> Você também pode editar diretamente os arquivos de dados na pasta 
                <code className="mx-1 px-1 py-0.5 bg-white/70 rounded text-xs font-mono">src/data</code>
                seguindo as instruções no arquivo README.md nessa pasta.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeginnersGuide;
