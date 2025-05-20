import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Card className="overflow-hidden border bg-white shadow-md transition-all hover:shadow-lg h-full">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || "https://placehold.co/400x400"}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 hover:scale-105 ${isOutOfStock ? 'opacity-70' : ''}`}
            loading="lazy"
          />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-store-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Destaque
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Esgotado
          </div>
        )}
      </div>
      
      <CardContent className="p-3 text-left">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          {!isOutOfStock && product.stock !== undefined && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {product.stock} em estoque
            </Badge>
          )}
        </div>
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
          disabled={isOutOfStock}
          className={`w-full rounded-full text-white text-sm py-1 h-auto ${
            isOutOfStock 
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
              : 'bg-store-pink hover:bg-store-pink/90'
          }`}
        >
          {isOutOfStock ? (
            <XCircle className="mr-1 h-3 w-3" />
          ) : (
            <ShoppingCart className="mr-1 h-3 w-3" />
          )}
          {isOutOfStock ? 'Esgotado' : 'Adicionar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
