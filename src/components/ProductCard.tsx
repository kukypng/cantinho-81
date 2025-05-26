
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart, XCircle, Package, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Card className="overflow-hidden border-2 border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:border-store-pink/20 h-full group hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl || "https://placehold.co/400x400"}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            loading="lazy"
          />
        </div>
        
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-store-pink to-store-purple text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse backdrop-blur-sm">
            ✨ Destaque
          </div>
        )}
        
        {product.stock !== undefined && product.stock > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-green-100">
            <Package className="h-3 w-3 text-green-600" />
            <span className="text-green-700">{product.stock}</span>
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-xl">
              <XCircle className="h-4 w-4" /> 
              Esgotado
            </div>
          </div>
        )}
        
        {/* Quick action button melhorado */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/95 hover:bg-white hover:text-store-pink shadow-xl border-2 border-white h-12 w-12 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              !isOutOfStock && addToCart(product);
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? <XCircle className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4 text-left">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-3 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-store-pink">
            R$ {product.price.toFixed(2)}
          </p>
          {product.category && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-medium">
              {product.category}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className={`w-full rounded-full text-white text-sm font-semibold py-3 h-auto transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed opacity-60' 
              : 'bg-gradient-to-r from-store-pink to-store-purple hover:from-store-pink/90 hover:to-store-purple/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isOutOfStock ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Produto Esgotado
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
