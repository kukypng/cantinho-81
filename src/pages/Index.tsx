
import React, { useState } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin, BellRing, Search } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  
  // Estado para busca de produtos
  const [searchTerm, setSearchTerm] = useState("");

  // Extrai todas as categorias únicas dos produtos
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));

  // Filtra os produtos pela categoria selecionada e termo de busca
  const filteredProducts = products
    .filter(product => !selectedCategory || product.category === selectedCategory)
    .filter(product => 
      !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <StoreLayout>
      <div className="container mx-auto p-4">
        {/* Banner principal */}
        <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-store-pink to-store-light-pink shadow-lg">
          <div className="px-6 py-8 md:py-12 text-white text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 animate-fade-in">Bem-vindo(a)!</h1>
            <p className="text-lg opacity-90 max-w-lg mx-auto animate-fade-in">
              Confira nossos produtos incríveis e aproveite as ofertas
            </p>
          </div>
        </div>

        {/* Área de avisos personalizados */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-store-pink/5 to-store-pink/10 p-4 space-y-3 shadow-sm">
          {settings.announcements && settings.announcements.length > 0 ? (
            settings.announcements.map((announcement, index) => (
              <Alert key={index} variant="info" className="bg-white/70 backdrop-blur-sm border-store-pink/20 animate-fade-in hover-scale transition-all">
                <BellRing className="h-4 w-4 text-store-pink" />
                <AlertTitle className="text-store-pink font-medium">Aviso</AlertTitle>
                <AlertDescription className="text-gray-700">
                  {announcement}
                </AlertDescription>
              </Alert>
            ))
          ) : (
            // Exibe o banner de entrega grátis apenas se o limite estiver configurado e não há avisos personalizados
            settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-gray-900 bg-gradient-to-r from-store-yellow to-store-yellow/80 shadow-md bounce-subtle">
                  <MapPin className="h-5 w-5 text-store-pink" />
                  Entrega Grátis acima de R$ {settings.freeDeliveryThreshold}
                </div>
              </div>
            )
          )}
        </div>

        {/* Barra de pesquisa */}
        <div className="mb-6 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-store-pink focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filtro de categorias - aparece apenas se houver categorias definidas */}
        {categories.length > 0 && (
          <div className="mb-6 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedCategory(null)} 
              className={`${selectedCategory === null ? "bg-gradient-to-r from-store-pink to-store-pink/90 hover:opacity-90" : ""} whitespace-nowrap rounded-full shadow-sm`}
            >
              Todos
            </Button>
            {categories.map(category => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory(category)} 
                className={`${selectedCategory === category ? "bg-gradient-to-r from-store-pink to-store-pink/90 hover:opacity-90" : ""} whitespace-nowrap rounded-full shadow-sm`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Grade de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {/* Mensagem quando não há produtos na categoria selecionada */}
        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")} 
                className="mt-4"
              >
                Limpar busca
              </Button>
            )}
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
