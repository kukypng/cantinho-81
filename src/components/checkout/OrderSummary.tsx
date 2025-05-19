
import React from "react";
import { CartItem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CartItemCard from "@/components/CartItemCard";
import { CheckCircle, Loader2 } from "lucide-react";
import CouponForm from "./CouponForm";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  hasFreeDelivery: boolean;
  total: number;
  isDelivery: boolean;
  isLoading: boolean;
  discountAmount?: number;
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
  discountAmount = 0,
  onCheckout,
}: OrderSummaryProps) => {
  return (
    <div className="rounded-xl border bg-white/90 p-4 md:p-6 shadow-md backdrop-blur-sm animate-fade-in">
      <h2 className="mb-4 text-xl font-semibold text-gradient">Resumo do Pedido</h2>
      
      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto scrollbar-none">
        {items.map((item) => (
          <CartItemCard key={item.product.id} item={item} allowEdit={false} />
        ))}
      </div>
      
      <Separator className="my-4" />
      
      {/* Coupon Form */}
      <div className="mb-4">
        <CouponForm />
      </div>
      
      <div className="space-y-3 text-sm md:text-base">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Taxa de Entrega</span>
          <span>
            {isDelivery 
              ? (hasFreeDelivery 
                ? <span className="text-store-green font-medium">Grátis</span> 
                : `R$ ${deliveryFee.toFixed(2)}`)
              : "N/A"}
          </span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-store-green">
            <span className="font-medium">Desconto</span>
            <span className="font-medium">-R$ {discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <Separator />
        <div className="flex justify-between font-medium text-base md:text-lg">
          <span>Total</span>
          <span className="text-store-pink font-bold">R$ {total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button
        className="mt-6 w-full bg-gradient-to-r from-store-green to-store-green/90 hover:shadow-lg text-white py-3 font-medium text-base rounded-xl"
        onClick={onCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            Finalizar Pedido
          </>
        )}
      </Button>
      
      <p className="mt-3 text-center text-xs text-gray-600">
        Você será redirecionado para o WhatsApp para confirmar seu pedido
      </p>
    </div>
  );
};

export default OrderSummary;
