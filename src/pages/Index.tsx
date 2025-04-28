
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
      <div className="space-y-6 px-4 py-6">
        {/* Store header section */}
        <div className="text-center space-y-4 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {settings.storeName}
          </h1>
          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm text-store-pink">
                <MapPin className="h-4 w-4" />
                Entrega Grátis acima de R$ {settings.freeDeliveryThreshold.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`${
                selectedCategory === null 
                  ? "bg-store-pink hover:bg-store-pink/90" 
                  : "border-store-pink/30 text-store-pink hover:bg-store-pink/10"
              } rounded-full px-6`}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? "bg-store-pink hover:bg-store-pink/90" 
                    : "border-store-pink/30 text-store-pink hover:bg-store-pink/10"
                } whitespace-nowrap rounded-full px-6`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
