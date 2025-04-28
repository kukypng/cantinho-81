
import React, { useState } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin, Heart } from "lucide-react";

const Index = () => {
  const { products } = useProducts();
  const { settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <StoreLayout>
      <div className="container mx-auto space-y-8">
        {/* Store name and delivery info */}
        <div className="mb-6 px-4">
          <h1 className="text-center text-4xl font-bold">
            {settings.storeName}
          </h1>
          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-50/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-store-pink shadow-sm">
                <MapPin className="h-4 w-4" />
                Entrega Grátis acima de R$ {settings.freeDeliveryThreshold.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`${
                selectedCategory === null 
                  ? "bg-store-pink hover:bg-store-pink/90" 
                  : "border-store-pink/30 text-store-pink hover:text-store-pink hover:bg-store-pink/10"
              } whitespace-nowrap rounded-full px-6`}
            >
              Todos os Produtos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? "bg-store-pink hover:bg-store-pink/90" 
                    : "border-store-pink/30 text-store-pink hover:text-store-pink hover:bg-store-pink/10"
                } whitespace-nowrap rounded-full px-6`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center text-store-pink">
              <Heart className="h-16 w-16 mb-3 animate-pulse" />
              <p className="text-lg font-medium text-store-pink">Nenhum produto encontrado</p>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
