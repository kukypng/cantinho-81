
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cookie, Shield, FileText, Check, X } from "lucide-react";
import { useLegalNotices } from "@/hooks/useLegalNotices";

const LegalNotices: React.FC = () => {
  const { notices, acceptNotice, acceptAllNotices, hasUnacceptedNotices } = useLegalNotices();

  if (!hasUnacceptedNotices) return null;

  return (
    <Dialog open={hasUnacceptedNotices}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto [&>button]:hidden border-2 border-store-pink/20 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl text-store-pink">
            <div className="p-2 bg-gradient-to-br from-store-pink/10 to-store-purple/10 rounded-xl">
              <Shield className="h-6 w-6" />
            </div>
            Avisos Importantes
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Para uma melhor experiência, precisamos do seu consentimento para alguns itens:
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cookies Notice */}
          {!notices.cookies && (
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-orange-700 text-xl">
                  <div className="p-2 bg-orange-200 rounded-lg">
                    <Cookie className="h-5 w-5" />
                  </div>
                  Uso de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Este site utiliza cookies para melhorar sua experiência de navegação, 
                  lembrar suas preferências e analisar o tráfego do site. Os cookies são 
                  armazenados localmente em seu dispositivo e nos ajudam a personalizar o conteúdo.
                </p>
                <Button 
                  onClick={() => acceptNotice('cookies')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aceitar Cookies
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Usage Notice */}
          {!notices.dataUsage && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-700 text-xl">
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  Proteção de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Seus dados pessoais são protegidos e utilizados apenas para processar 
                  pedidos e melhorar nossos serviços. Respeitamos sua privacidade e não 
                  compartilhamos suas informações com terceiros sem seu consentimento explícito.
                </p>
                <Button 
                  onClick={() => acceptNotice('dataUsage')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Entendi
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Terms Notice */}
          {!notices.terms && (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  Termos de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Ao utilizar este site, você concorda com nossos termos de uso. 
                  Os preços podem variar sem aviso prévio e todos os produtos estão 
                  sujeitos à disponibilidade. Garantimos qualidade e satisfação.
                </p>
                <Button 
                  onClick={() => acceptNotice('terms')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aceitar Termos
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center pt-6 border-t border-gray-200">
            <Button 
              onClick={acceptAllNotices}
              className="bg-gradient-to-r from-store-pink via-store-purple to-store-pink hover:from-store-pink/90 hover:via-store-purple/90 hover:to-store-pink/90 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Check className="h-5 w-5 mr-2" />
              Aceitar Todos os Avisos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalNotices;
