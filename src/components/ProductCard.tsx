
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
    <Card className="group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
      <div className="aspect-square overflow-hidden bg-gray-50 rounded-t-xl">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-store-pink to-store-pink/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Destaque
          </div>
        )}
      </div>
      <CardContent className="space-y-2 p-4">
        <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="text-lg font-bold text-store-pink">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full rounded-full bg-store-pink text-sm font-medium hover:bg-store-pink/90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
