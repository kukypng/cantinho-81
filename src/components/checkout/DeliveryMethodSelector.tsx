
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
    <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50/40 shadow-md backdrop-blur-sm p-6">
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${value === "delivery" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200"}`}>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery" className="flex items-center font-medium text-base">
              <span>Entrega a Domicílio</span>
            </Label>
          </div>
        </div>
        
        <div className={`flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${value === "pickup" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200"}`}>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup" className="flex items-center font-medium text-base">
              <span>Retirada no Local</span>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DeliveryMethodSelector;
