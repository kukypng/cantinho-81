
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import CartItemCard from "@/components/CartItemCard";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useCoupon } from "@/context/CouponContext";
import CouponForm from "@/components/checkout/CouponForm";

const Cart = () => {
  const { items, clearCart, subtotal } = useCart();
  const { settings } = useStore();
  const { calculateDiscount } = useCoupon();
  const navigate = useNavigate();

  // Calculate totals
  const deliveryFee = settings.deliveryFee || 0;
  const hasFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const calculatedDeliveryFee = hasFreeDelivery ? 0 : deliveryFee;
  const discountAmount = calculateDiscount(subtotal, calculatedDeliveryFee);
  const total = subtotal + calculatedDeliveryFee - discountAmount;

  return (
    <StoreLayout>
      <div className="container max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="mb-5 text-xl sm:text-2xl font-bold text-gradient">Seu Carrinho</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 sm:p-12 text-center bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="rounded-full bg-gray-100 p-5 sm:p-6 mb-4">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h2 className="mb-2 text-lg sm:text-xl font-semibold">Seu carrinho está vazio</h2>
            <p className="mb-6 text-gray-500 max-w-md">
              Adicione alguns produtos para começar a comprar
            </p>
            <Link to="/">
              <Button className="bg-store-pink hover:bg-store-pink/90 hover:shadow-md transition-all">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="space-y-3 sm:space-y-4 animate-fade-in">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>

              <div className="mt-5 sm:mt-6 flex justify-between">
                <Button
                  variant="outline"
                  className="text-sm group hover:border-store-pink hover:text-store-pink transition-colors"
                  onClick={() => navigate("/")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
                  Continuar Comprando
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600 group"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Limpar Carrinho
                </Button>
              </div>
            </div>

            <div className="animate-fade-in">
              <div className="rounded-lg border bg-white/90 backdrop-blur-sm p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <h2 className="mb-4 text-lg font-medium text-gray-800">Resumo do Pedido</h2>
                
                <div className="mb-4">
                  <CouponForm />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxa de Entrega</span>
                    <span>
                      {hasFreeDelivery 
                        ? <span className="text-green-600">Grátis</span> 
                        : `R$ ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-store-pink text-lg">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="mt-5 sm:mt-6 w-full bg-gradient-to-r from-store-pink to-store-purple text-white hover:shadow-lg transition-all duration-300 group"
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                  <p className="flex items-center">
                    Pagamento seguro
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Cart;
