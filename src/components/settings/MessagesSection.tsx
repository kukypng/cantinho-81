import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, MapPin } from "lucide-react";
import HelpTooltip from "./HelpTooltip";
import { Switch } from "@/components/ui/switch";
interface MessagesSectionProps {
  welcomeMessage: string;
  footerMessage: string;
  customCakeMessage: string;
  announcements: string[];
  freeDeliveryMessage: string;
  showFreeDeliveryBanner: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAnnouncementAdd: () => void;
  onAnnouncementChange: (index: number, value: string) => void;
  onAnnouncementRemove: (index: number) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}
const MessagesSection: React.FC<MessagesSectionProps> = ({
  welcomeMessage,
  footerMessage,
  customCakeMessage,
  announcements = [],
  freeDeliveryMessage = "",
  showFreeDeliveryBanner = true,
  onInputChange,
  onAnnouncementAdd,
  onAnnouncementChange,
  onAnnouncementRemove,
  onSwitchChange
}) => {
  return <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Mensagens e Avisos</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="welcomeMessage" className="flex items-center gap-2">
              Mensagem de Boas-vindas
              <HelpTooltip text="Esta mensagem aparece na barra superior do site" />
            </Label>
            <Input id="welcomeMessage" name="welcomeMessage" value={welcomeMessage} onChange={onInputChange} placeholder="Bem-vindo à nossa loja!" />
          </div>
          
          <div>
            <Label htmlFor="footerMessage" className="flex items-center gap-2">
              Mensagem no Rodapé
              <HelpTooltip text="Esta mensagem aparece no rodapé de todas as páginas" />
            </Label>
            <Input id="footerMessage" name="footerMessage" value={footerMessage} onChange={onInputChange} placeholder="Feito com amor ❤️" />
          </div>
          
          <div>
            <Label htmlFor="customCakeMessage" className="flex items-center gap-2">
              Texto para Bolos Personalizados
              <HelpTooltip text="Esta mensagem aparece no formulário de pedido de bolos personalizados" />
            </Label>
            <Textarea id="customCakeMessage" name="customCakeMessage" value={customCakeMessage} onChange={onInputChange} placeholder="Descreva seu bolo personalizado e entraremos em contato com um orçamento." rows={3} />
          </div>
          
          <div className="border p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <Label htmlFor="showFreeDeliveryBanner" className="flex items-center gap-2">
                Banner de Entrega Grátis
                <HelpTooltip text="Ativa/desativa o banner de entrega grátis na página inicial" />
              </Label>
              <Switch id="showFreeDeliveryBanner" checked={showFreeDeliveryBanner} onCheckedChange={checked => onSwitchChange("showFreeDeliveryBanner", checked)} />
            </div>
            
            {showFreeDeliveryBanner && <div className="mb-3">
                <Label htmlFor="freeDeliveryMessage" className="flex items-center gap-2 mb-2">
                  Texto do Banner
                  <HelpTooltip text="Esta mensagem aparecerá no banner amarelo de entrega grátis" />
                </Label>
                <Input id="freeDeliveryMessage" name="freeDeliveryMessage" value={freeDeliveryMessage} onChange={onInputChange} placeholder="Entrega Grátis acima de R$ XX" />
                
                <div className="mt-3 bg-store-yellow rounded-full p-2 px-4 inline-flex items-center gap-2 shadow-sm">
                  <MapPin className="h-4 w-4 text-store-pink" />
                  <span className="text-sm font-medium">{freeDeliveryMessage || "Entrega Grátis acima de R$ XX"}</span>
                </div>
              </div>}
          </div>
          
          <div>
            
            
            <div className="space-y-2">
              {announcements.map((announcement, index) => <div key={index} className="flex items-center gap-2">
                  <Input value={announcement} onChange={e => onAnnouncementChange(index, e.target.value)} placeholder="Digite seu aviso aqui" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => onAnnouncementRemove(index)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>)}
              
              {announcements.length === 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default MessagesSection;