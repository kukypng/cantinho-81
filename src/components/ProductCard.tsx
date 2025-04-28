
import React from "react";
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
    <div className="flex flex-col rounded-lg bg-white">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.imageUrl || "https://placehold.co/400x400"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-medium line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto pt-3">
          <p className="mb-2 text-xl font-semibold text-store-pink">
            R$ {product.price.toFixed(2)}
          </p>
          <Button
            onClick={() => addToCart(product)}
            className="w-full bg-store-pink hover:bg-store-pink/90 rounded-full"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
