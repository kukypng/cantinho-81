
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden border-none bg-white shadow-sm">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="space-y-2 p-4">
        <h3 className="font-medium text-lg text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <p className="text-xl font-semibold text-store-pink">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-store-pink hover:bg-store-pink/90 text-white"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
