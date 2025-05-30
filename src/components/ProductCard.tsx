
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart, XCircle, Package, Heart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    
    setIsAdding(true);
    addToCart(product);
    
    // Resetar o estado após 1.5 segundos
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <Card className="overflow-hidden border bg-white shadow-md transition-all hover:shadow-lg h-full group">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || "https://placehold.co/400x400"}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'opacity-70' : ''}`}
            loading="lazy"
          />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-store-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
            Destaque
          </div>
        )}
        
        {/* Stock badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {/* Stock count badge */}
          {product.stock !== undefined && product.stock > 0 && (
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              <Package className="h-3 w-3 text-green-600" />
              <span className="text-green-700">{product.stock}</span>
            </div>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold py-2 px-4 flex items-center justify-center gap-1.5 shadow-lg">
            <XCircle className="h-4 w-4" /> Esgotado
          </div>
        )}
        
        {/* Quick action button that appears on hover */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/90 hover:bg-white hover:text-store-pink shadow-lg h-10 w-10"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? <XCircle className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3 text-left">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        </div>
        <p className="text-lg font-bold text-store-pink">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`w-full rounded-full text-white text-sm py-1 h-auto transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
              : isAdding
              ? 'bg-green-500 hover:bg-green-500 scale-105 shadow-lg'
              : 'bg-store-pink hover:bg-store-pink/90 shadow-sm hover:shadow-md'
          } ${isAdding ? 'animate-pulse' : ''}`}
        >
          {isOutOfStock ? (
            <>
              <XCircle className="mr-1 h-3 w-3" />
              Esgotado
            </>
          ) : isAdding ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              Adicionado!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1 h-3 w-3" />
              Adicionar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
