
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="space-y-1.5 p-3">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="text-lg font-bold text-store-pink">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full rounded-full bg-store-pink text-sm hover:bg-store-pink/90"
        >
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
