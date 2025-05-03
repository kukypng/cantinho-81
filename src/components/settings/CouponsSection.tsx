
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coupon } from "@/types";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface CouponsSectionProps {
  coupons: Coupon[];
  onCouponAdd: (coupon: Coupon) => void;
  onCouponUpdate: (coupon: Coupon) => void;
  onCouponDelete: (code: string) => void;
}

const CouponsSection: React.FC<CouponsSectionProps> = ({
  coupons,
  onCouponAdd,
  onCouponUpdate,
  onCouponDelete
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const defaultCoupon: Coupon = {
    code: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    active: true,
    description: "",
    expiryDate: "",
    usageLimit: 0,
    usageCount: 0
  };
  
  const [formValues, setFormValues] = useState<Coupon>(defaultCoupon);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;
    
    if (type === "number") {
      processedValue = value ? parseFloat(value) : 0;
    } else if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormValues({
      ...formValues,
      [name]: processedValue
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormValues({
      ...formValues,
      [name]: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the coupon code
    const formattedCode = formValues.code.toUpperCase();
    const updatedCoupon = { ...formValues, code: formattedCode };
    
    // Don't allow duplicate codes
    if (!editingCoupon && coupons.some(c => c.code === formattedCode)) {
      alert("Já existe um cupom com este código. Por favor, use um código diferente.");
      return;
    }
    
    if (editingCoupon) {
      onCouponUpdate(updatedCoupon);
    } else {
      onCouponAdd(updatedCoupon);
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setFormValues(defaultCoupon);
    setEditingCoupon(null);
    setShowForm(false);
  };
  
  const handleEditCoupon = (coupon: Coupon) => {
    setFormValues({ ...coupon });
    setEditingCoupon(coupon);
    setShowForm(true);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Cupons de Desconto</h2>
          <Button 
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? "Cancelar" : <><Plus className="h-4 w-4 mr-1" /> Novo Cupom</>}
          </Button>
        </div>
        
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-md">
            <h3 className="font-medium">
              {editingCoupon ? "Editar Cupom" : "Criar Novo Cupom"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code" className="flex items-center gap-2">
                  Código do Cupom
                  <HelpTooltip text="O código que o cliente irá digitar para aplicar o desconto" />
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formValues.code}
                  onChange={handleInputChange}
                  placeholder="DESCONTO10"
                  className="uppercase"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="discountType">Tipo de Desconto</Label>
                <Select
                  value={formValues.discountType}
                  onValueChange={(value) => handleSelectChange("discountType", value)}
                >
                  <SelectTrigger id="discountType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="discountValue" className="flex items-center gap-2">
                  Valor do Desconto
                  <HelpTooltip 
                    text={formValues.discountType === "percentage" ? 
                      "Porcentagem de desconto (Ex: 10 para 10%)" : 
                      "Valor fixo de desconto em reais (Ex: 10 para R$10,00)"} 
                  />
                </Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  value={formValues.discountValue}
                  onChange={handleInputChange}
                  min="0"
                  step={formValues.discountType === "percentage" ? "1" : "0.01"}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="minOrderValue" className="flex items-center gap-2">
                  Valor Mínimo do Pedido
                  <HelpTooltip text="Valor mínimo que o cliente precisa comprar para usar este cupom (0 = sem mínimo)" />
                </Label>
                <Input
                  id="minOrderValue"
                  name="minOrderValue"
                  type="number"
                  value={formValues.minOrderValue}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="expiryDate" className="flex items-center gap-2">
                  Data de Expiração
                  <HelpTooltip text="Deixe em branco para um cupom sem data de expiração" />
                </Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formValues.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="usageLimit" className="flex items-center gap-2">
                  Limite de Usos
                  <HelpTooltip text="Número máximo de vezes que este cupom pode ser usado (0 = ilimitado)" />
                </Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  value={formValues.usageLimit}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Descrição do Cupom
                  <HelpTooltip text="Uma descrição clara do que este cupom oferece" />
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="10% de desconto em todos os produtos"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formValues.active}
                  onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Cupom Ativo
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingCoupon ? "Salvar Alterações" : "Criar Cupom"}
              </Button>
            </div>
          </form>
        )}
        
        <div className="space-y-4">
          {coupons.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border border-dashed rounded-md">
              Nenhum cupom de desconto criado ainda.
              <br />
              <Button variant="link" onClick={() => setShowForm(true)}>
                Clique aqui para criar seu primeiro cupom
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div 
                  key={coupon.code}
                  className={`p-4 border rounded-md ${!coupon.active ? 'bg-gray-50 opacity-75' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tag className={`h-5 w-5 mr-2 ${coupon.active ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="font-medium">{coupon.code}</span>
                      
                      {!coupon.active && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                          Inativo
                        </span>
                      )}
                      
                      {coupon.expiryDate && new Date(coupon.expiryDate) < new Date() && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Expirado
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCoupon(coupon)}
                        className="h-8 text-gray-500"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCouponDelete(coupon.code)}
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Desconto:</span>{" "}
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `R$ ${coupon.discountValue.toFixed(2)}`}
                    </div>
                    
                    {coupon.minOrderValue > 0 && (
                      <div>
                        <span className="text-gray-500">Pedido mínimo:</span>{" "}
                        R$ {coupon.minOrderValue.toFixed(2)}
                      </div>
                    )}
                    
                    {coupon.expiryDate && (
                      <div>
                        <span className="text-gray-500">Expira em:</span>{" "}
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {coupon.usageLimit > 0 && (
                      <div>
                        <span className="text-gray-500">Limite de uso:</span>{" "}
                        {coupon.usageCount || 0}/{coupon.usageLimit}
                      </div>
                    )}
                    
                    <div className="md:col-span-2 text-gray-600 mt-1">
                      {coupon.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponsSection;
