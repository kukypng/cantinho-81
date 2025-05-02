
import React from "react";
import { HelpCircle } from "lucide-react";
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
        <HelpCircle className="h-4 w-4 text-primary/60 ml-2 cursor-help transition-colors hover:text-primary" />
      </TooltipTrigger>
      <TooltipContent className="glass-morphism border-none shadow-lg animate-scale-in">
        <p className="max-w-xs text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default HelpTooltip;
