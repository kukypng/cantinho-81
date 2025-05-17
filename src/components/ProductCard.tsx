
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
    <Card className="group relative overflow-hidden border-none rounded-xl bg-white/90 backdrop-blur-sm shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
      {product.featured && (
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-store-pink to-store-pink/80 py-1 text-center">
          <span className="text-xs font-bold text-white">Destaque</span>
        </div>
      )}
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
          className="w-full rounded-full bg-gradient-to-r from-store-pink to-store-pink/80 text-sm font-medium hover:shadow-md hover:opacity-90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
