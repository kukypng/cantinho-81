
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import DeliveryMethodSelector from "@/components/checkout/DeliveryMethodSelector";
import ShippingInfoForm from "@/components/checkout/ShippingInfoForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    complement: "",
    district: "",
    reference: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [needChange, setNeedChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");

  const deliveryFee = settings.deliveryFee || 0;
  const hasFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const total = subtotal + (deliveryMethod === "delivery" && !hasFreeDelivery ? deliveryFee : 0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const formatWhatsAppMessage = () => {
    let message = `*Novo Pedido em ${settings.storeName}*\n\n`;
    
    message += "*Produtos:*\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} - ${item.quantity}x R$ ${item.product.price.toFixed(2)} = R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}`;
    
    if (deliveryMethod === "delivery") {
      message += `\n*Taxa de Entrega:* ${hasFreeDelivery ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}`;
    }
    
    message += `\n*Valor Total:* R$ ${total.toFixed(2)}`;
    message += `\n\n*Método de Entrega:* ${deliveryMethod === "delivery" ? "Entrega" : "Retirada no Local"}`;
    
    if (deliveryMethod === "delivery") {
      message += `\n\n*Dados de Entrega:*`;
      message += `\nNome: ${shippingInfo.name}`;
      message += `\nEndereço: ${shippingInfo.address}`;
      message += `\nComplemento: ${shippingInfo.complement || "N/A"}`;
      message += `\nBairro: ${shippingInfo.district}`;
      message += `\nPonto de Referência: ${shippingInfo.reference || "N/A"}`;
    }
    
    message += `\n\n*Método de Pagamento:* ${paymentMethod === "pix" ? "PIX" : paymentMethod === "card" ? "Cartão" : "Dinheiro"}`;
    
    if (paymentMethod === "cash") {
      if (needChange) {
        message += `\n*Troco:* Sim, para ${changeAmount}`;
      } else {
        message += "\n*Troco:* Não precisa";
      }
    }
    
    return encodeURIComponent(message);
  };
  
  const handleCheckout = () => {
    if (deliveryMethod === "delivery" && (!shippingInfo.address || !shippingInfo.district)) {
      toast.error("Por favor, preencha o endereço de entrega.");
      return;
    }
    
    if (paymentMethod === "cash" && needChange && !changeAmount) {
      toast.error("Por favor, informe o valor para troco.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
      const message = formatWhatsAppMessage();
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
      
      clearCart();
      window.open(whatsappLink, "_blank");
      toast.success("Seu pedido foi enviado para o WhatsApp!");
      navigate("/");
    } catch (error) {
      console.error("Error sending to WhatsApp:", error);
      toast.error("Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
              onChange={setDeliveryMethod}
            />

            {deliveryMethod === "delivery" && (
              <ShippingInfoForm 
                shippingInfo={shippingInfo}
                onChange={handleInputChange}
              />
            )}

            <PaymentMethodSelector 
              value={paymentMethod}
              onChange={setPaymentMethod}
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
