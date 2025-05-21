
import React, { useRef } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import DeliveryMethodSelector from "@/components/checkout/DeliveryMethodSelector";
import ShippingInfoForm from "@/components/checkout/ShippingInfoForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import CustomCakeForm from "@/components/checkout/CustomCakeForm";
import useCheckout from "@/hooks/useCheckout";
import { useStore } from "@/context/StoreContext";
import { ArrowRight, ArrowUp, Truck, CreditCard, Cake } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { settings } = useStore();
  const isMobile = useIsMobile();
  const topRef = useRef<HTMLDivElement>(null);
  const {
    items,
    subtotal,
    deliveryFee,
    hasFreeDelivery,
    total,
    isLoading,
    deliveryMethod,
    shippingInfo,
    paymentMethod,
    needChange,
    changeAmount,
    customCakeDetails,
    hasCustomCakeItem,
    discountAmount,
    handleInputChange,
    handleDeliveryMethodChange,
    handlePaymentMethodChange,
    setNeedChange,
    setChangeAmount,
    handleCustomCakeDetailsChange,
    handleCheckout
  } = useCheckout();

  // Early return if cart is empty
  if (items.length === 0) {
    return null;
  }

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <StoreLayout>
      <div ref={topRef} className="container mx-auto px-3 py-4 md:px-4 md:py-8 animate-fade-in">
        <h1 className="mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-gradient">
          Finalizar Pedido
        </h1>

        <div className={`grid gap-5 md:gap-8 ${isMobile ? '' : 'md:grid-cols-3'}`}>
          <div className={`${isMobile ? 'order-2' : 'md:col-span-2'} space-y-4 md:space-y-6`}>
            <div className="flex items-center mb-3 md:mb-6">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-store-pink to-store-purple flex items-center justify-center mr-2 md:mr-3 shadow-md">
                <span className="text-white font-semibold text-xs md:text-sm">1</span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gradient flex items-center">
                <Truck className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Entrega
              </h2>
            </div>
            
            <DeliveryMethodSelector 
              value={deliveryMethod}
              onChange={handleDeliveryMethodChange}
            />

            {deliveryMethod === "delivery" && (
              <div className="pl-6 md:pl-10 border-l-2 border-primary/20 py-2 animate-fade-in-slide">
                <ShippingInfoForm 
                  shippingInfo={shippingInfo}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {hasCustomCakeItem && (
              <>
                <div className="flex items-center mb-3 md:mb-6 mt-6 md:mt-10">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-store-pink to-store-purple flex items-center justify-center mr-2 md:mr-3 shadow-md">
                    <span className="text-white font-semibold text-xs md:text-sm">2</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-gradient flex items-center">
                    <Cake className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Personalização
                  </h2>
                </div>
                <div className="pl-6 md:pl-10 border-l-2 border-primary/20 py-2 animate-fade-in-slide">
                  <CustomCakeForm
                    customCakeDetails={customCakeDetails}
                    customCakeMessage={settings.customCakeMessage || ""}
                    onChange={handleCustomCakeDetailsChange}
                  />
                </div>
              </>
            )}

            <div className="flex items-center mb-3 md:mb-6 mt-6 md:mt-10">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-store-pink to-store-purple flex items-center justify-center mr-2 md:mr-3 shadow-md">
                <span className="text-white font-semibold text-xs md:text-sm">3</span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gradient flex items-center">
                <CreditCard className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Pagamento
              </h2>
            </div>
            <div className="pl-6 md:pl-10 border-l-2 border-primary/20 py-2 animate-fade-in-slide">
              <PaymentMethodSelector 
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                needChange={needChange}
                changeAmount={changeAmount}
                onChangeOptionChange={setNeedChange}
                onChangeAmountChange={setChangeAmount}
              />
            </div>
            
            <div className="flex justify-center mt-8 mb-4">
              <Button 
                onClick={scrollToTop} 
                variant="outline" 
                size="lg"
                className="rounded-full shadow-md hover:shadow-lg"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Voltar ao topo
              </Button>
            </div>
          </div>

          <div className={`${isMobile ? 'order-1 mb-4' : 'md:sticky md:top-24 self-start'}`}>
            <div className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-xl p-1 shadow-md backdrop-blur-md">
              <OrderSummary 
                items={items}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                hasFreeDelivery={hasFreeDelivery}
                total={total}
                isDelivery={deliveryMethod === "delivery"}
                isLoading={isLoading}
                discountAmount={discountAmount}
                onCheckout={handleCheckout}
              />
              
              <div className="flex items-center justify-center py-2 md:py-3 px-3 md:px-4 bg-primary/5 rounded-lg mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-primary animate-pulse" />
                <p>Complete seu pedido para finalizar a compra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Checkout;
