
import React from "react";
import { Instagram, HelpCircle } from "lucide-react";
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

interface SocialMediaSectionProps {
  instagram: string;
  whatsapp: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SocialMediaSection = ({
  instagram,
  whatsapp,
  onInputChange
}: SocialMediaSectionProps) => {
  return (
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
            value={instagram}
            onChange={onInputChange}
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
            value={whatsapp}
            onChange={onInputChange}
            placeholder="Ex: https://wa.me/5511999999999"
          />
          <p className="text-xs text-gray-500">
            Você pode usar o formato https://wa.me/SEU_NUMERO (com o código do país)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
