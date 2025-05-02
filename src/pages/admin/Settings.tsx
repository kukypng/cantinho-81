
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Phone, 
  Truck, 
  MessageSquare, 
  Instagram, 
  Save,
  HelpCircle
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Componente de dica de ajuda
const HelpTooltip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Settings = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
    welcomeMessage: settings.welcomeMessage || "",
    footerMessage: settings.footerMessage || "",
    customCakeMessage: settings.customCakeMessage || "",
    instagram: settings.socialMedia?.instagram || "",
    whatsapp: settings.socialMedia?.whatsapp || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare socialMedia object
    const socialMedia = {
      instagram: formData.instagram,
      whatsapp: formData.whatsapp
    };
    
    // Update settings
    updateSettings({
      ...settings,
      storeName: formData.storeName,
      whatsappNumber: formData.whatsappNumber,
      deliveryFee: formData.deliveryFee,
      freeDeliveryThreshold: formData.freeDeliveryThreshold,
      welcomeMessage: formData.welcomeMessage,
      footerMessage: formData.footerMessage,
      customCakeMessage: formData.customCakeMessage,
      socialMedia
    });
    
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <AdminLayout title="Configurações da Loja">
      <div className="space-y-6">
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

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informações da Loja
                </CardTitle>
                <CardDescription>
                  Configure as informações básicas que aparecem para seus clientes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="storeName">Nome da Loja</Label>
                    <HelpTooltip text="Este é o nome que aparecerá no topo do site e nos pedidos" />
                  </div>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="Ex: Minha Loja Online"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
                    <HelpTooltip text="Este número receberá as mensagens de pedidos. Use o formato internacional (com código do país)" />
                  </div>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="Ex: 5511999999999 (com código do país e DDD)"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Use o formato internacional: 55 (Brasil) + DDD + número.
                    Exemplo: 5511999999999 (sem espaços ou caracteres especiais)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Configurações de Entrega
                </CardTitle>
                <CardDescription>
                  Configure as taxas e regras de entrega.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                    <HelpTooltip text="Valor cobrado pela entrega. Use 0 para entrega gratuita para todos os pedidos" />
                  </div>
                  <Input
                    id="deliveryFee"
                    name="deliveryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="freeDeliveryThreshold">
                      Valor Mínimo para Entrega Grátis (R$)
                    </Label>
                    <HelpTooltip text="Quando o pedido atingir este valor, a entrega será gratuita" />
                  </div>
                  <Input
                    id="freeDeliveryThreshold"
                    name="freeDeliveryThreshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.freeDeliveryThreshold}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500">
                    Deixe como 0 para desativar a entrega grátis.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensagens e Textos
                </CardTitle>
                <CardDescription>
                  Personalize as mensagens exibidas na sua loja.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                    <HelpTooltip text="Aparece na página inicial da loja. Pode ficar em branco" />
                  </div>
                  <Input
                    id="welcomeMessage"
                    name="welcomeMessage"
                    value={formData.welcomeMessage}
                    onChange={handleInputChange}
                    placeholder="Ex: Bem-vindo à nossa loja de doces artesanais!"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="footerMessage">Mensagem do Rodapé</Label>
                    <HelpTooltip text="Aparece na parte inferior de todas as páginas" />
                  </div>
                  <Input
                    id="footerMessage"
                    name="footerMessage"
                    value={formData.footerMessage}
                    onChange={handleInputChange}
                    placeholder="Ex: Produtos feitos com ❤️"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="customCakeMessage">Mensagem para Bolos Personalizados</Label>
                    <HelpTooltip text="Instrução que aparece no formulário de pedido de bolos personalizados" />
                  </div>
                  <Textarea
                    id="customCakeMessage"
                    name="customCakeMessage"
                    value={formData.customCakeMessage}
                    onChange={handleInputChange}
                    placeholder="Ex: Descreva como você quer seu bolo personalizado..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5" />
                  Redes Sociais
                </CardTitle>
                <CardDescription>
                  Configure os links para suas redes sociais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="instagram">Link do Instagram</Label>
                    <HelpTooltip text="URL completa do seu perfil no Instagram" />
                  </div>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Ex: https://instagram.com/sualoja"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="whatsapp">Link do WhatsApp</Label>
                    <HelpTooltip text="Link para iniciar conversa no WhatsApp" />
                  </div>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Ex: https://wa.me/5511999999999"
                  />
                  <p className="text-xs text-gray-500">
                    Você pode usar o formato https://wa.me/SEU_NUMERO (com o código do país)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="flex items-center gap-2 ml-auto">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
