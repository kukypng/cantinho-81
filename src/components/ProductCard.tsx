
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
    <Card className="group relative overflow-hidden border border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-2xl">
      <div className="aspect-square overflow-hidden bg-gray-50 rounded-t-2xl relative">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.featured && (
          <div className="absolute top-3 left-0 bg-gradient-to-r from-store-pink to-store-pink/80 text-white text-xs font-bold px-4 py-1 rounded-r-full shadow-md">
            Destaque
          </div>
        )}
      </div>
      <CardContent className="space-y-3 p-5">
        <h3 className="font-semibold text-gray-900 line-clamp-1 text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="text-xl font-bold text-store-pink">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full rounded-full py-5 bg-gradient-to-r from-store-pink to-store-pink/90 text-sm font-medium hover:shadow-md hover:opacity-95 hover:scale-[1.02] transition-all"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
