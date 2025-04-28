
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import CartItemCard from "@/components/CartItemCard";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, MapPin, Store, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

  const deliveryFee = settings.deliveryFee || 0;
  const hasFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const total = subtotal + (deliveryMethod === "delivery" && !hasFreeDelivery ? deliveryFee : 0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const formatWhatsAppMessage = () => {
    let message = `*Novo Pedido em ${settings.storeName}*\n\n`;
    
    message += "*🛒 Produtos:*\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} - ${item.quantity}x R$ ${item.product.price.toFixed(2)} = R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*💰 Subtotal:* R$ ${subtotal.toFixed(2)}`;
    
    if (deliveryMethod === "delivery") {
      message += `\n*🚚 Taxa de Entrega:* ${hasFreeDelivery ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}`;
    }
    
    message += `\n*💵 Valor Total:* R$ ${total.toFixed(2)}`;
    message += `\n\n*📍 Método de Entrega:* ${deliveryMethod === "delivery" ? "Entrega" : "Retirada no Local"}`;
    
    if (deliveryMethod === "delivery") {
      message += `\n\n*📍 Dados de Entrega:*`;
      message += `\nNome: ${shippingInfo.name}`;
      message += `\nEndereço: ${shippingInfo.address}`;
      message += `\nComplemento: ${shippingInfo.complement || "N/A"}`;
      message += `\nBairro: ${shippingInfo.district}`;
      message += `\nPonto de Referência: ${shippingInfo.reference || "N/A"}`;
    }
    
    message += `\n\n*💳 Método de Pagamento:* ${paymentMethod === "pix" ? "PIX" : paymentMethod === "card" ? "Cartão" : "Dinheiro"}`;
    
    return encodeURIComponent(message);
  };
  
  const handleCheckout = () => {
    if (deliveryMethod === "delivery" && (!shippingInfo.address || !shippingInfo.district)) {
      toast.error("Por favor, preencha o endereço de entrega.");
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
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 flex items-center text-lg font-medium">
                <Truck className="mr-2 h-5 w-5 text-store-pink" />
                Método de Entrega
              </h2>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex items-center">
                    <span className="ml-2">Entrega a Domicílio</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center">
                    <span className="ml-2">Retirada no Local</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {deliveryMethod === "delivery" && (
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center text-lg font-medium">
                  <MapPin className="mr-2 h-5 w-5 text-store-pink" />
                  Informações de Entrega
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      Nome
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="mb-1 block text-sm font-medium">
                      Endereço
                    </label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Rua, número"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="complement" className="mb-1 block text-sm font-medium">
                      Complemento
                    </label>
                    <Input
                      id="complement"
                      name="complement"
                      placeholder="Apartamento, bloco, etc."
                      value={shippingInfo.complement}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="district" className="mb-1 block text-sm font-medium">
                      Bairro
                    </label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Seu bairro"
                      value={shippingInfo.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="reference" className="mb-1 block text-sm font-medium">
                      Ponto de Referência
                    </label>
                    <Textarea
                      id="reference"
                      name="reference"
                      placeholder="Próximo a..."
                      value={shippingInfo.reference}
                      onChange={handleInputChange}
                      className="h-20"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-medium">Método de Pagamento</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center">
                    <span className="ml-2">PIX</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <span className="ml-2">Cartão</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center">
                    <span className="ml-2">Dinheiro</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-medium">Resumo do Pedido</h2>
              
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} allowEdit={false} />
                ))}
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa de Entrega</span>
                  <span>
                    {deliveryMethod === "delivery" 
                      ? (hasFreeDelivery 
                        ? <span className="text-green-600">Grátis</span> 
                        : `R$ ${deliveryFee.toFixed(2)}`)
                      : "N/A"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                className="mt-6 w-full bg-green-600 hover:bg-green-700"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Finalizar no WhatsApp
                  </>
                )}
              </Button>
              
              <p className="mt-3 text-center text-xs text-gray-500">
                Você será redirecionado para o WhatsApp para confirmar seu pedido
              </p>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Checkout;
