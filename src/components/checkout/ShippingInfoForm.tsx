
import React from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ShippingInfo {
  name: string;
  address: string;
  complement: string;
  district: string;
  reference: string;
}

interface ShippingInfoFormProps {
  shippingInfo: ShippingInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ShippingInfoForm = ({ shippingInfo, onChange }: ShippingInfoFormProps) => {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 flex items-center text-lg font-medium">
        <MapPin className="mr-2 h-5 w-5 text-store-pink" />
        Informações de Entrega
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Nome
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Seu nome"
            value={shippingInfo.name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium">
            Endereço
          </label>
          <Input
            id="address"
            name="address"
            placeholder="Rua, número"
            value={shippingInfo.address}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="complement" className="mb-1 block text-sm font-medium">
            Complemento
          </label>
          <Input
            id="complement"
            name="complement"
            placeholder="Apartamento, bloco, etc."
            value={shippingInfo.complement}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="district" className="mb-1 block text-sm font-medium">
            Bairro
          </label>
          <Input
            id="district"
            name="district"
            placeholder="Seu bairro"
            value={shippingInfo.district}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="reference" className="mb-1 block text-sm font-medium">
            Ponto de Referência
          </label>
          <Textarea
            id="reference"
            name="reference"
            placeholder="Próximo a..."
            value={shippingInfo.reference}
            onChange={onChange}
            className="h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoForm;
