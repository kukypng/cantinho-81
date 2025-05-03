
import React from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import DeliveryMethodSelector from "@/components/checkout/DeliveryMethodSelector";
import ShippingInfoForm from "@/components/checkout/ShippingInfoForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import CustomCakeForm from "@/components/checkout/CustomCakeForm";
import useCheckout from "@/hooks/useCheckout";
import { useStore } from "@/context/StoreContext";
import { ArrowRight } from "lucide-react";

const Checkout = () => {
  const { settings } = useStore();
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

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="mb-8 text-3xl font-bold text-gradient">
          Finalizar Pedido
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-semibold text-sm">1</span>
              </div>
              <h2 className="text-xl font-semibold text-gradient">Entrega</h2>
            </div>
            
            <DeliveryMethodSelector 
              value={deliveryMethod}
              onChange={handleDeliveryMethodChange}
            />

            {deliveryMethod === "delivery" && (
              <div className="pl-10 border-l-2 border-primary/20 py-2 animate-fade-in">
                <ShippingInfoForm 
                  shippingInfo={shippingInfo}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {hasCustomCakeItem && (
              <>
                <div className="flex items-center mb-6 mt-10">
                  <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center mr-3 shadow-md">
                    <span className="text-white font-semibold text-sm">2</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gradient">Personalização</h2>
                </div>
                <div className="pl-10 border-l-2 border-primary/20 py-2 animate-fade-in">
                  <CustomCakeForm
                    customCakeDetails={customCakeDetails}
                    customCakeMessage={settings.customCakeMessage || ""}
                    onChange={handleCustomCakeDetailsChange}
                  />
                </div>
              </>
            )}

            <div className="flex items-center mb-6 mt-10">
              <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              <h2 className="text-xl font-semibold text-gradient">Pagamento</h2>
            </div>
            <div className="pl-10 border-l-2 border-primary/20 py-2 animate-fade-in">
              <PaymentMethodSelector 
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                needChange={needChange}
                changeAmount={changeAmount}
                onChangeOptionChange={setNeedChange}
                onChangeAmountChange={setChangeAmount}
              />
            </div>
          </div>

          <div className="md:sticky md:top-24 self-start">
            <div className="bg-gradient-to-br from-white/70 to-gray-50/70 rounded-xl p-1 shadow-md backdrop-blur-md">
              <OrderSummary 
                items={items}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                hasFreeDelivery={hasFreeDelivery}
                total={total}
                isDelivery={deliveryMethod === "delivery"}
                isLoading={isLoading}
                onCheckout={handleCheckout}
              />
              
              <div className="flex items-center justify-center py-3 px-4 bg-primary/5 rounded-lg mt-4 text-sm text-gray-600">
                <ArrowRight className="h-4 w-4 mr-2 text-primary" />
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
