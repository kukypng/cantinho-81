
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-white to-pink-50/80 shadow-lg hover:shadow-xl transition-all duration-500">
      <div className="absolute right-4 top-4 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-pink-50 hover:text-store-pink"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <CardContent className="space-y-2 p-6">
        <div className="min-h-[4rem] space-y-1">
          <h3 className="font-medium text-xl tracking-tight text-foreground line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 tracking-wide">
            {product.description}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-store-pink tracking-tight">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-store-pink hover:bg-store-pink/90 group-hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-store-pink/25"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span className="tracking-wide">Adicionar ao Carrinho</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
