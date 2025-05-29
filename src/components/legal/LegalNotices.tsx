
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cookie, Shield, FileText, Check } from "lucide-react";
import { useLegalNotices } from "@/hooks/useLegalNotices";

const LegalNotices: React.FC = () => {
  const { notices, acceptNotice, acceptAllNotices, hasUnacceptedNotices } = useLegalNotices();

  if (!hasUnacceptedNotices) return null;

  return (
    <Dialog open={hasUnacceptedNotices}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto [&>button]:hidden border-2 border-store-pink/20 shadow-2xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-xl text-store-pink">
            <div className="p-1.5 bg-gradient-to-br from-store-pink/10 to-store-purple/10 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            Avisos Importantes
          </DialogTitle>
          <p className="text-xs text-gray-600 mt-1">
            Para uma melhor experiência, precisamos do seu consentimento:
          </p>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Cookies Notice */}
          {!notices.cookies && (
            <Card className="border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-orange-700 text-base">
                  <div className="p-1.5 bg-orange-200 rounded-md">
                    <Cookie className="h-4 w-4" />
                  </div>
                  Uso de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                  Este site utiliza cookies para melhorar sua experiência de navegação e lembrar suas preferências.
                </p>
                <Button 
                  onClick={() => acceptNotice('cookies')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 text-xs"
                  size="sm"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Aceitar Cookies
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Usage Notice */}
          {!notices.dataUsage && (
            <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-base">
                  <div className="p-1.5 bg-blue-200 rounded-md">
                    <Shield className="h-4 w-4" />
                  </div>
                  Proteção de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                  Seus dados pessoais são protegidos e utilizados apenas para processar pedidos e melhorar nossos serviços.
                </p>
                <Button 
                  onClick={() => acceptNotice('dataUsage')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 text-xs"
                  size="sm"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Entendi
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Terms Notice */}
          {!notices.terms && (
            <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-700 text-base">
                  <div className="p-1.5 bg-purple-200 rounded-md">
                    <FileText className="h-4 w-4" />
                  </div>
                  Termos de Uso
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                  Ao utilizar este site, você concorda com nossos termos de uso. Os preços podem variar sem aviso prévio.
                </p>
                <Button 
                  onClick={() => acceptNotice('terms')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 text-xs"
                  size="sm"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Aceitar Termos
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center pt-3 border-t border-gray-200">
            <Button 
              onClick={acceptAllNotices}
              className="bg-gradient-to-r from-store-pink via-store-purple to-store-pink hover:from-store-pink/90 hover:via-store-purple/90 hover:to-store-pink/90 text-white font-semibold px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 h-9 text-sm"
              size="sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Aceitar Todos os Avisos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalNotices;
