
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface MessagesSectionProps {
  welcomeMessage: string;
  footerMessage: string;
  customCakeMessage: string;
  announcements: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAnnouncementAdd: () => void;
  onAnnouncementChange: (index: number, value: string) => void;
  onAnnouncementRemove: (index: number) => void;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({
  welcomeMessage,
  footerMessage,
  customCakeMessage,
  announcements = [],
  onInputChange,
  onAnnouncementAdd,
  onAnnouncementChange,
  onAnnouncementRemove
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Mensagens e Avisos</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="welcomeMessage" className="flex items-center gap-2">
              Mensagem de Boas-vindas
              <HelpTooltip content="Esta mensagem aparece na barra superior do site" />
            </Label>
            <Input
              id="welcomeMessage"
              name="welcomeMessage"
              value={welcomeMessage}
              onChange={onInputChange}
              placeholder="Bem-vindo à nossa loja!"
            />
          </div>
          
          <div>
            <Label htmlFor="footerMessage" className="flex items-center gap-2">
              Mensagem no Rodapé
              <HelpTooltip content="Esta mensagem aparece no rodapé de todas as páginas" />
            </Label>
            <Input
              id="footerMessage"
              name="footerMessage"
              value={footerMessage}
              onChange={onInputChange}
              placeholder="Feito com amor ❤️"
            />
          </div>
          
          <div>
            <Label htmlFor="customCakeMessage" className="flex items-center gap-2">
              Texto para Bolos Personalizados
              <HelpTooltip content="Esta mensagem aparece no formulário de pedido de bolos personalizados" />
            </Label>
            <Textarea
              id="customCakeMessage"
              name="customCakeMessage"
              value={customCakeMessage}
              onChange={onInputChange}
              placeholder="Descreva seu bolo personalizado e entraremos em contato com um orçamento."
              rows={3}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2">
                Avisos na Página Inicial
                <HelpTooltip content="Estes avisos aparecerão no topo da página inicial" />
              </Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={onAnnouncementAdd}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" /> 
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-2">
              {announcements.map((announcement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={announcement}
                    onChange={(e) => onAnnouncementChange(index, e.target.value)}
                    placeholder="Digite seu aviso aqui"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onAnnouncementRemove(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {announcements.length === 0 && (
                <div className="text-sm text-gray-500 py-2 px-3 border border-dashed rounded-md text-center">
                  Clique em "Adicionar" para criar avisos que aparecerão na página inicial
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
