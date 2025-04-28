
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  needChange: boolean;
  changeAmount: string;
  onChangeOptionChange: (needChange: boolean) => void;
  onChangeAmountChange: (amount: string) => void;
}

const PaymentMethodSelector = ({ 
  value, 
  onChange, 
  needChange, 
  changeAmount, 
  onChangeOptionChange,
  onChangeAmountChange 
}: PaymentMethodSelectorProps) => {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-lg font-medium">Método de Pagamento</h2>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pix" id="pix" />
          <Label htmlFor="pix" className="flex items-center">
            <span className="ml-2">PIX</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center">
            <span className="ml-2">Cartão</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex items-center">
            <span className="ml-2">Dinheiro</span>
          </Label>
        </div>
        
        {value === "cash" && (
          <div className="mt-3 border-t pt-3">
            <p className="mb-2 text-sm font-medium">Precisa de troco?</p>
            <RadioGroup value={needChange ? "need-change" : "no-change"} onValueChange={(value) => onChangeOptionChange(value === "need-change")} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-change" id="no-change" />
                <Label htmlFor="no-change">Não</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="need-change" id="need-change" />
                <Label htmlFor="need-change">Sim</Label>
              </div>
            </RadioGroup>
            
            {needChange && (
              <div className="mt-3">
                <Label htmlFor="change-amount" className="mb-1 block text-sm">
                  Para quanto?
                </Label>
                <Input
                  id="change-amount"
                  type="text"
                  value={changeAmount}
                  onChange={(e) => onChangeAmountChange(e.target.value)}
                  placeholder="Ex: R$ 50,00"
                  className="max-w-[200px]"
                />
              </div>
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
