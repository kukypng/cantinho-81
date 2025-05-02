
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { CartItem } from "@/types";

export type DeliveryMethodType = "delivery" | "pickup";
export type PaymentMethodType = "pix" | "card" | "cash";

export interface ShippingInfoType {
  name: string;
  address: string;
  complement: string;
  district: string;
  reference: string;
}

const useCheckout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>("delivery");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType>({
    name: "",
    address: "",
    complement: "",
    district: "",
    reference: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("pix");
  const [needChange, setNeedChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");
  const [customCakeDetails, setCustomCakeDetails] = useState("");

  // Check if any item is a custom cake
  const hasCustomCakeItem = items.some(item => 
    item.product.category === "Bolos Personalizados"
  );
  
  // Calculate total with delivery fee logic
  const deliveryFee = settings.deliveryFee || 0;
  const hasFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const total = subtotal + (deliveryMethod === "delivery" && !hasFreeDelivery ? deliveryFee : 0);
  
  // Handle shipping form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle custom cake details change
  const handleCustomCakeDetailsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomCakeDetails(e.target.value);
  }, []);
  
  // Format WhatsApp message with all order details
  const formatWhatsAppMessage = useCallback(() => {
    let message = `*Novo Pedido em ${settings.storeName}*\n\n`;
    
    // Add products
    message += "*Produtos:*\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} - ${item.quantity}x R$ ${item.product.price.toFixed(2)} = R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
      
      // Add custom cake details if this item is a custom cake
      if (item.product.category === "Bolos Personalizados" && customCakeDetails) {
        message += `   *Detalhes do Bolo Personalizado:* ${customCakeDetails}\n`;
      }
    });
    
    // Add pricing information
    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}`;
    
    if (deliveryMethod === "delivery") {
      message += `\n*Taxa de Entrega:* ${hasFreeDelivery ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}`;
    }
    
    message += `\n*Valor Total:* R$ ${total.toFixed(2)}`;
    message += `\n\n*Método de Entrega:* ${deliveryMethod === "delivery" ? "Entrega" : "Retirada no Local"}`;
    
    // Add delivery information if applicable
    if (deliveryMethod === "delivery") {
      message += `\n\n*Dados de Entrega:*`;
      message += `\nNome: ${shippingInfo.name}`;
      message += `\nEndereço: ${shippingInfo.address}`;
      message += `\nComplemento: ${shippingInfo.complement || "N/A"}`;
      message += `\nBairro: ${shippingInfo.district}`;
      message += `\nPonto de Referência: ${shippingInfo.reference || "N/A"}`;
    }
    
    // Add payment information
    message += `\n\n*Método de Pagamento:* ${paymentMethod === "pix" ? "PIX" : paymentMethod === "card" ? "Cartão" : "Dinheiro"}`;
    
    if (paymentMethod === "cash") {
      if (needChange) {
        message += `\n*Troco:* Sim, para ${changeAmount}`;
      } else {
        message += "\n*Troco:* Não precisa";
      }
    }
    
    return encodeURIComponent(message);
  }, [items, subtotal, deliveryMethod, hasFreeDelivery, deliveryFee, total, shippingInfo, paymentMethod, needChange, changeAmount, customCakeDetails, settings.storeName]);
  
  // Type-safe handlers for component props
  const handleDeliveryMethodChange = (value: string) => {
    setDeliveryMethod(value as DeliveryMethodType);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethodType);
  };
  
  // Handle checkout process
  const handleCheckout = useCallback(() => {
    // Form validation
    if (deliveryMethod === "delivery" && (!shippingInfo.address || !shippingInfo.district)) {
      toast.error("Por favor, preencha o endereço de entrega.");
      return;
    }
    
    if (paymentMethod === "cash" && needChange && !changeAmount) {
      toast.error("Por favor, informe o valor para troco.");
      return;
    }

    if (hasCustomCakeItem && !customCakeDetails.trim()) {
      toast.error("Por favor, descreva os detalhes do seu bolo personalizado.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format phone number and create WhatsApp link
      const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
      const message = formatWhatsAppMessage();
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
      
      // Clear cart, send to WhatsApp, and redirect
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
  }, [
    deliveryMethod, 
    shippingInfo, 
    paymentMethod, 
    needChange, 
    changeAmount, 
    hasCustomCakeItem, 
    customCakeDetails, 
    settings.whatsappNumber, 
    formatWhatsAppMessage, 
    clearCart, 
    navigate
  ]);

  return {
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
  };
};

export default useCheckout;
