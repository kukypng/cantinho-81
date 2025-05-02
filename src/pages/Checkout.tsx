
import React from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import DeliveryMethodSelector from "@/components/checkout/DeliveryMethodSelector";
import ShippingInfoForm from "@/components/checkout/ShippingInfoForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import CustomCakeForm from "@/components/checkout/CustomCakeForm";
import useCheckout from "@/hooks/useCheckout";
import { useStore } from "@/context/StoreContext";

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Finalizar Pedido</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <DeliveryMethodSelector 
              value={deliveryMethod}
              onChange={handleDeliveryMethodChange}
            />

            {deliveryMethod === "delivery" && (
              <ShippingInfoForm 
                shippingInfo={shippingInfo}
                onChange={handleInputChange}
              />
            )}

            {hasCustomCakeItem && (
              <CustomCakeForm
                customCakeDetails={customCakeDetails}
                customCakeMessage={settings.customCakeMessage || ""}
                onChange={handleCustomCakeDetailsChange}
              />
            )}

            <PaymentMethodSelector 
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              needChange={needChange}
              changeAmount={changeAmount}
              onChangeOptionChange={setNeedChange}
              onChangeAmountChange={setChangeAmount}
            />
          </div>

          <div>
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
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Checkout;
