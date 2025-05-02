
import React from "react";
import { Store, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface StoreInfoSectionProps {
  storeName: string;
  whatsappNumber: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StoreInfoSection = ({ 
  storeName, 
  whatsappNumber, 
  onInputChange 
}: StoreInfoSectionProps) => {
  return (
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
            value={storeName}
            onChange={onInputChange}
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
            value={whatsappNumber}
            onChange={onInputChange}
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
  );
};

export default StoreInfoSection;
