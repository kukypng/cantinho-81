
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomCakeFormProps {
  customCakeDetails: string;
  customCakeMessage: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomCakeForm = ({ 
  customCakeDetails, 
  customCakeMessage, 
  onChange 
}: CustomCakeFormProps) => {
  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <h2 className="text-lg font-medium">Detalhes do Bolo Personalizado</h2>
      <div className="space-y-2">
        <Label htmlFor="customCakeDetails" className="font-medium">
          {customCakeMessage || "Descreva como deseja seu bolo personalizado:"}
        </Label>
        <Textarea
          id="customCakeDetails"
          placeholder="Ex: Bolo para aniversário de 15 anos, tema floral, cobertura de chocolate e decoração em tons de rosa..."
          value={customCakeDetails}
          onChange={onChange}
          className="min-h-[120px]"
          required
        />
      </div>
    </div>
  );
};

export default CustomCakeForm;
