
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

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <StoreLayout>
      {/* Free delivery banner */}
      <div className="container mx-auto px-4 py-6">
        {/* Banner */}
        <div className="mb-8 rounded-lg bg-red-50 px-4 py-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
            {settings.storeName}
          </h2>
          <div className="flex justify-center">
            <div className="mt-2 inline-flex items-center rounded-full bg-store-yellow px-4 py-1">
              <MapPin className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">Entrega Grátis</span>
            </div>
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-store-pink hover:bg-store-pink/90" : ""}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-store-pink hover:bg-store-pink/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
