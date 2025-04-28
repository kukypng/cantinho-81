
import React from "react";
import { CartItem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CartItemCard from "@/components/CartItemCard";
import { CheckCircle, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  hasFreeDelivery: boolean;
  total: number;
  isDelivery: boolean;
  isLoading: boolean;
  onCheckout: () => void;
}

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee,
  hasFreeDelivery,
  total,
  isDelivery,
  isLoading,
  onCheckout,
}: OrderSummaryProps) => {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-lg font-medium">Resumo do Pedido</h2>
      
      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <CartItemCard key={item.product.id} item={item} allowEdit={false} />
        ))}
      </div>
      
      <Separator className="my-3" />
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Taxa de Entrega</span>
          <span>
            {isDelivery 
              ? (hasFreeDelivery 
                ? <span className="text-green-600">Grátis</span> 
                : `R$ ${deliveryFee.toFixed(2)}`)
              : "N/A"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button
        className="mt-6 w-full bg-green-600 hover:bg-green-700"
        onClick={onCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar no WhatsApp
          </>
        )}
      </Button>
      
      <p className="mt-3 text-center text-xs text-gray-500">
        Você será redirecionado para o WhatsApp para confirmar seu pedido
      </p>
    </div>
  );
};

export default OrderSummary;
