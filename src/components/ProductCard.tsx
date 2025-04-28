
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
    <Card className="apple-card group overflow-hidden bg-white border-none">
      <div className="aspect-square overflow-hidden rounded-t-2xl">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="space-y-3 p-5">
        <h3 className="font-medium text-lg tracking-tight text-foreground line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 tracking-wide">
          {product.description}
        </p>
        <p className="text-lg font-semibold text-store-pink tracking-tight">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full group-hover:scale-[1.02] transition-transform duration-300"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span className="tracking-wide">Adicionar</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
