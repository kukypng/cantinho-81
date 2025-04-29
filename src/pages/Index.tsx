import React, { useState } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin } from "lucide-react";
const Index = () => {
  const {
    products
  } = useProducts();
  const {
    settings
  } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));
  const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
  return <StoreLayout>
      <div className="container mx-auto p-4">
        {/* Store name and delivery info */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-store-pink/5 to-store-pink/10 p-6">
          <h1 className="text-center text-3xl font-bold text-gray-800">
            {settings.storeName}
          </h1>
          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && <div className="mt-3 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900 bg-store-yellow">
                <MapPin className="h-4 w-4 text-store-pink" />
                Entrega Grátis acima de R$ {settings.freeDeliveryThreshold}
              </div>
            </div>}
        </div>

        {/* Category filter */}
        {categories.length > 0 && <div className="mb-6 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)} className={selectedCategory === null ? "bg-store-pink hover:bg-store-pink/90 whitespace-nowrap" : "whitespace-nowrap"}>
              Todos
            </Button>
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className={`${selectedCategory === category ? "bg-store-pink hover:bg-store-pink/90" : ""} whitespace-nowrap`}>
                {category}
              </Button>)}
          </div>}

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {filteredProducts.length === 0 && <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
          </div>}
      </div>
    </StoreLayout>;
};
export default Index;