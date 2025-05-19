
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
    <Card className="overflow-hidden border bg-white shadow-md transition-all hover:shadow-lg h-full">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || "https://placehold.co/400x400"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-store-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Destaque
          </div>
        )}
      </div>
      
      <CardContent className="p-3 text-left">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mb-2">
          {product.description}
        </p>
        <p className="text-lg font-bold text-store-pink">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full rounded-full bg-store-pink text-white hover:bg-store-pink/90 text-sm py-1 h-auto"
        >
          <ShoppingCart className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
