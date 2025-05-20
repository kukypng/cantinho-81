
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartItem as CartItemType } from "@/types";

interface CartItemCardProps {
  item: CartItemType;
  allowEdit?: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, allowEdit = true }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <Card className="mb-4 bg-white/90 backdrop-blur-sm hover-scale-sm border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="flex items-center p-4">
        <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg shadow-sm group">
          <img
            src={product.imageUrl || "https://placehold.co/400x400"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">
            R$ {product.price.toFixed(2)} x {quantity}
          </p>
          <p className="font-bold text-store-pink">
            R$ {(product.price * quantity).toFixed(2)}
          </p>
        </div>
        {allowEdit && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-full px-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full p-0 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-2 w-6 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full p-0 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
