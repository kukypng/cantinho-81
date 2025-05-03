import React, { useState } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin } from "lucide-react";

/**
 * Página inicial da loja
 * 
 * Esta é a página principal que os clientes verão quando visitarem o site
 * Exibe o catálogo de produtos, filtros de categoria e informações da loja
 */
const Index = () => {
  // Obtém a lista de produtos do contexto
  const {
    products
  } = useProducts();

  // Obtém as configurações da loja do contexto
  const {
    settings
  } = useStore();

  // Estado para armazenar a categoria selecionada no filtro
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extrai todas as categorias únicas dos produtos
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));

  // Filtra os produtos pela categoria selecionada, ou mostra todos se nenhuma estiver selecionada
  const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
  return <StoreLayout>
      <div className="container mx-auto p-4">
        {/* Cabeçalho com nome da loja e informações de entrega */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-store-pink/5 to-store-pink/10 p-6">
          
          {/* Exibe o banner de entrega grátis apenas se o limite estiver configurado */}
          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && <div className="mt-3 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900 bg-[#fec832]">
                <MapPin className="h-4 w-4 text-store-pink" />
                Entrega Grátis acima de R$ {settings.freeDeliveryThreshold}
              </div>
            </div>}
        </div>

        {/* Filtro de categorias - aparece apenas se houver categorias definidas */}
        {categories.length > 0 && <div className="mb-6 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)} className={selectedCategory === null ? "bg-store-pink hover:bg-store-pink/90 whitespace-nowrap" : "whitespace-nowrap"}>
              Todos
            </Button>
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className={`${selectedCategory === category ? "bg-store-pink hover:bg-store-pink/90" : ""} whitespace-nowrap`}>
                {category}
              </Button>)}
          </div>}

        {/* Grade de produtos */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {/* Mensagem quando não há produtos na categoria selecionada */}
        {filteredProducts.length === 0 && <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
          </div>}
      </div>
    </StoreLayout>;
};
export default Index;