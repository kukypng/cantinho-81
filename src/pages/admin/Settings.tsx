
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
import { Store, Phone, Truck, MessageSquare } from "lucide-react";

const Settings = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
    welcomeMessage: settings.welcomeMessage || "",
    footerMessage: settings.footerMessage || "",
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
    updateSettings({
      ...settings,
      ...formData,
    });
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <AdminLayout title="Configurações da Loja">
      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informações da Loja
                </CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua loja.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
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
                  <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
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
                  <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
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
                  <Label htmlFor="freeDeliveryThreshold">
                    Valor Mínimo para Entrega Grátis (R$)
                  </Label>
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
                  <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                  <Input
                    id="welcomeMessage"
                    name="welcomeMessage"
                    value={formData.welcomeMessage}
                    onChange={handleInputChange}
                    placeholder="Ex: Feito com muito amor ❤️"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="footerMessage">Mensagem do Rodapé</Label>
                  <Input
                    id="footerMessage"
                    name="footerMessage"
                    value={formData.footerMessage}
                    onChange={handleInputChange}
                    placeholder="Ex: Produtos feitos com ❤️"
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="ml-auto">
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
