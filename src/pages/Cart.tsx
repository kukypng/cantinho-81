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
import { useIsMobile } from "@/hooks/use-mobile";
const Cart = () => {
  const {
    items,
    clearCart,
    subtotal
  } = useCart();
  const {
    settings
  } = useStore();
  const {
    calculateDiscount
  } = useCoupon();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate totals
  const deliveryFee = settings.deliveryFee || 0;
  const hasFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const calculatedDeliveryFee = hasFreeDelivery ? 0 : deliveryFee;
  const discountAmount = calculateDiscount(subtotal, calculatedDeliveryFee);
  const total = subtotal + calculatedDeliveryFee - discountAmount;
  return <StoreLayout>
      <div className="container max-w-4xl mx-auto px-3 py-4 sm:py-6">
        <div className="mb-4 flex items-center">
          <h1 className="text-lg sm:text-xl font-bold text-gradient">Seu Carrinho</h1>
          <div className="ml-auto">
            
          </div>
        </div>

        {items.length === 0 ? <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 sm:p-8 text-center bg-white/90 backdrop-blur-sm shadow-sm">
            <div className="rounded-full bg-gray-100 p-4 sm:p-5 mb-3">
              <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h2 className="mb-2 text-base sm:text-lg font-semibold">Seu carrinho está vazio</h2>
            <p className="mb-4 text-sm text-gray-500 max-w-md">
              Adicione alguns produtos para começar a comprar
            </p>
            <Link to="/">
              <Button className="bg-store-pink hover:bg-store-pink/90 hover:shadow-md transition-all">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div> : <div className="grid gap-4 md:grid-cols-11">
            <div className="md:col-span-6 lg:col-span-7">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <h2 className="text-base font-medium text-gray-800 mb-3 flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4 text-store-pink" />
                  Itens do Carrinho ({items.length})
                </h2>
                <div className="space-y-2 sm:space-y-3 animate-fade-in max-h-[60vh] overflow-y-auto pr-1 pb-1">
                  {items.map(item => <CartItemCard key={item.product.id} item={item} />)}
                </div>

                <div className="mt-3 sm:mt-4 flex justify-between">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm group hover:border-store-pink hover:text-store-pink transition-colors" onClick={() => navigate("/")}>
                    <ShoppingBag className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-[-2px] transition-transform" />
                    Continuar Comprando
                  </Button>
                  {items.length > 0 && <Button variant="ghost" size="sm" className="flex items-center text-xs sm:text-sm text-red-500 hover:bg-red-50 hover:text-red-600 group" onClick={clearCart}>
                      <Trash2 className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
                      Limpar
                    </Button>}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 lg:col-span-4 animate-fade-in">
              <div className="rounded-xl border bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-sm hover:shadow-md transition-all sticky top-20">
                <h2 className="mb-3 text-base sm:text-lg font-medium text-gray-800 flex items-center border-b pb-2">
                  <span className="text-gradient">Resumo do Pedido</span>
                </h2>
                
                <div className="mb-3">
                  <CouponForm />
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Taxa de Entrega</span>
                    <span>
                      {hasFreeDelivery ? <span className="text-green-600">Grátis</span> : `R$ ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {discountAmount > 0 && <div className="flex justify-between text-green-600 text-xs sm:text-sm">
                      <span>Desconto</span>
                      <span>-R$ {discountAmount.toFixed(2)}</span>
                    </div>}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-store-pink text-base sm:text-lg">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-store-pink to-store-purple text-white hover:shadow-lg transition-all duration-300 group" onClick={() => navigate("/checkout")}>
                  {isMobile ? 'Finalizar' : 'Finalizar Compra'}
                  <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <p className="flex items-center">
                    Pagamento seguro
                    <svg className="ml-1 h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </p>
                </div>
                
                {hasFreeDelivery && <div className="mt-2 bg-green-50 border border-green-100 rounded-lg p-1.5 text-xs text-green-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Entrega gratuita aplicada
                  </div>}
              </div>
            </div>
          </div>}
      </div>
    </StoreLayout>;
};
export default Cart;