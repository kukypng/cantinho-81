
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import CartItemCard from "@/components/CartItemCard";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const Cart = () => {
  const { items, clearCart, subtotal } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();

  // Calculate totals
  const deliveryFee = settings.deliveryFee || 0;
  const hasFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const total = subtotal + (hasFreeDelivery ? 0 : deliveryFee);

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-store-pink">Carrinho</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-store-light-pink/30 p-12 text-center bg-white/50 backdrop-blur-sm">
            <ShoppingCart className="mb-4 h-12 w-12 text-store-light-pink" />
            <h2 className="mb-2 text-xl font-semibold text-store-pink">Seu carrinho está vazio</h2>
            <p className="mb-6 text-gray-500">
              Adicione alguns produtos para começar a comprar
            </p>
            <Link to="/">
              <Button className="bg-store-pink hover:bg-store-pink/90">Continuar Comprando</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  className="text-sm border-store-pink/30 text-store-pink hover:text-store-pink hover:bg-store-pink/10"
                  onClick={() => navigate("/")}
                >
                  Continuar Comprando
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Carrinho
                </Button>
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-store-light-pink/20 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-store-pink">Resumo do Pedido</h2>
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
                  <Separator className="bg-store-light-pink/30" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-store-pink">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="mt-4 w-full bg-store-pink hover:bg-store-pink/90"
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Cart;
