
import React from "react";
import { MessageSquare, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  text: string;
}

const HelpTooltip = ({ text }: HelpTooltipProps) => (
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

interface MessagesSectionProps {
  welcomeMessage: string;
  footerMessage: string;
  customCakeMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MessagesSection = ({
  welcomeMessage,
  footerMessage,
  customCakeMessage,
  onInputChange
}: MessagesSectionProps) => {
  return (
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
            value={welcomeMessage}
            onChange={onInputChange}
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
            value={footerMessage}
            onChange={onInputChange}
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
            value={customCakeMessage}
            onChange={onInputChange}
            placeholder="Ex: Descreva como você quer seu bolo personalizado..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
