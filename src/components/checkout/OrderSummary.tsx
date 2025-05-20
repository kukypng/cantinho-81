
import React from "react";
import { CartItem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CartItemCard from "@/components/CartItemCard";
import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import CouponForm from "./CouponForm";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`rounded-xl border bg-white/90 p-3 ${isMobile ? 'py-3' : 'p-4 md:p-6'} shadow-md backdrop-blur-sm animate-fade-in`}>
      <h2 className={`mb-3 ${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gradient`}>Resumo do Pedido</h2>
      
      <div className={`mb-3 max-h-48 md:max-h-64 space-y-2 md:space-y-3 overflow-y-auto scrollbar-none ${items.length > 1 ? 'border-b pb-2' : ''}`}>
        {items.map((item) => (
          <CartItemCard key={item.product.id} item={item} allowEdit={false} />
        ))}
      </div>
      
      {!isMobile && <Separator className="my-3 md:my-4" />}
      
      {/* Coupon Form */}
      <div className="mb-3 md:mb-4">
        <CouponForm />
      </div>
      
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
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
        
        <Separator className="my-1" />
        <div className="flex justify-between font-medium text-sm md:text-base">
          <span>Total</span>
          <span className="text-store-pink font-bold">R$ {total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button
        className={`mt-4 md:mt-6 w-full bg-gradient-to-r from-store-pink to-store-purple hover:shadow-lg text-white ${isMobile ? 'py-2 text-sm' : 'py-3 text-base'} font-medium rounded-xl`}
        onClick={onCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className={`mr-1.5 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'} animate-spin`} />
            Processando...
          </>
        ) : (
          <>
            <CheckCircle className={`mr-1.5 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            Finalizar Pedido
          </>
        )}
      </Button>
      
      <div className={`mt-2 md:mt-3 flex items-center justify-center text-center ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600`}>
        <ShieldCheck className="h-3 w-3 mr-1 text-gray-500" />
        <p>Pagamento seguro via WhatsApp</p>
      </div>
    </div>
  );
};

export default OrderSummary;
