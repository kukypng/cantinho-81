
import React, { useState } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin } from "lucide-react";

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
      <div className="container mx-auto p-4 space-y-8">
        {/* Store name and delivery info */}
        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-store-pink/5 via-store-light-pink/10 to-store-pink/5 p-8 backdrop-blur-sm border border-store-pink/10">
          <h1 className="text-center text-4xl font-bold text-gradient bg-gradient-to-r from-store-pink to-store-dark-pink">
            {settings.storeName}
          </h1>
          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm px-6 py-3 text-sm font-medium text-store-pink shadow-sm border border-store-pink/20">
                <MapPin className="h-4 w-4 text-store-pink" />
                Entrega Grátis acima de R$ {settings.freeDeliveryThreshold.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`${
                selectedCategory === null 
                  ? "bg-store-pink hover:bg-store-pink/90 shadow-lg hover:shadow-store-pink/25" 
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
                    ? "bg-store-pink hover:bg-store-pink/90 shadow-lg hover:shadow-store-pink/25" 
                    : "border-store-pink/30 text-store-pink hover:text-store-pink hover:bg-store-pink/10"
                } whitespace-nowrap rounded-full px-6`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
