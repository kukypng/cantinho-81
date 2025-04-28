
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
      <div className="container mx-auto p-4">
        {/* Store name and delivery info */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-store-light-pink/30 to-store-pink/10 p-6 shadow-md">
          <h1 className="text-center text-3xl font-bold text-store-pink">
            {settings.storeName}
          </h1>
          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
            <div className="mt-3 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-store-pink shadow-sm">
                <MapPin className="h-4 w-4 text-store-pink" />
                Entrega Grátis acima de R$ {settings.freeDeliveryThreshold.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-6 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-store-pink hover:bg-store-pink/90 whitespace-nowrap" : "whitespace-nowrap border-store-pink/30 text-store-pink hover:text-store-pink hover:bg-store-pink/10"}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category ? "bg-store-pink hover:bg-store-pink/90" : "border-store-pink/30 text-store-pink hover:text-store-pink hover:bg-store-pink/10"
                } whitespace-nowrap`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center text-store-pink">
              <Heart className="h-16 w-16 mb-3 animate-pulse-soft" />
              <p className="text-lg text-store-pink">Nenhum produto encontrado.</p>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
