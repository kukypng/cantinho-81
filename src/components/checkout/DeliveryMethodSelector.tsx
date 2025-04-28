
import React from "react";
import { Truck, Store } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DeliveryMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DeliveryMethodSelector = ({ value, onChange }: DeliveryMethodSelectorProps) => {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 flex items-center text-lg font-medium">
        <Truck className="mr-2 h-5 w-5 text-store-pink" />
        Método de Entrega
      </h2>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="delivery" id="delivery" />
          <Label htmlFor="delivery" className="flex items-center">
            <span className="ml-2">Entrega a Domicílio</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pickup" id="pickup" />
          <Label htmlFor="pickup" className="flex items-center">
            <span className="ml-2">Retirada no Local</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DeliveryMethodSelector;
