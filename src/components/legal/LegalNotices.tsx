
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cookie, Shield, FileText } from "lucide-react";
import { useLegalNotices } from "@/hooks/useLegalNotices";

const LegalNotices: React.FC = () => {
  const { notices, acceptNotice, acceptAllNotices, hasUnacceptedNotices } = useLegalNotices();

  if (!hasUnacceptedNotices) return null;

  return (
    <Dialog open={hasUnacceptedNotices}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-store-pink">
            <Shield className="h-5 w-5" />
            Avisos Importantes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Cookies Notice */}
          {!notices.cookies && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
                  <Cookie className="h-5 w-5" />
                  Uso de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Este site utiliza cookies para melhorar sua experiência de navegação, 
                  lembrar suas preferências e analisar o tráfego do site. Os cookies são 
                  armazenados localmente em seu dispositivo.
                </p>
                <Button 
                  onClick={() => acceptNotice('cookies')}
                  className="bg-orange-600 hover:bg-orange-700"
                  size="sm"
                >
                  Aceitar Cookies
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Usage Notice */}
          {!notices.dataUsage && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                  <Shield className="h-5 w-5" />
                  Proteção de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Seus dados pessoais são protegidos e utilizados apenas para processar 
                  pedidos e melhorar nossos serviços. Não compartilhamos suas informações 
                  com terceiros sem seu consentimento.
                </p>
                <Button 
                  onClick={() => acceptNotice('dataUsage')}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Entendi
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Terms Notice */}
          {!notices.terms && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                  <FileText className="h-5 w-5" />
                  Termos de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Ao utilizar este site, você concorda com nossos termos de uso. 
                  Os preços podem variar sem aviso prévio. Produtos sujeitos à disponibilidade.
                </p>
                <Button 
                  onClick={() => acceptNotice('terms')}
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  Aceitar Termos
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center pt-4 border-t">
            <Button 
              onClick={acceptAllNotices}
              className="bg-gradient-to-r from-store-pink to-store-purple hover:from-store-pink/90 hover:to-store-purple/90"
            >
              Aceitar Todos os Avisos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalNotices;
