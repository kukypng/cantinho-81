
import React, { useState } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin, BellRing } from "lucide-react";
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

  // Extrai todas as categorias únicas dos produtos
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));

  // Filtra os produtos pela categoria selecionada, ou mostra todos se nenhuma estiver selecionada
  const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
  
  return (
    <StoreLayout>
      <div className="container mx-auto p-4">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-store-pink/10 to-store-blue/5 p-6 text-center shadow-sm">
          <h1 className="text-gradient mb-2 text-3xl font-bold">{settings.storeName}</h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            {settings.welcomeMessage || "Bem-vindo à nossa loja! Confira nossos produtos incríveis."}
          </p>
        </div>
        
        {/* Área de avisos personalizados */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-store-pink/5 to-store-pink/10 p-4 space-y-3">
          {settings.announcements && settings.announcements.length > 0 ? (
            settings.announcements.map((announcement, index) => (
              <Alert key={index} className="animate-fade-in bg-white/80 backdrop-blur-sm border-store-pink/20 shadow-sm hover:shadow-md transition-all">
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
                <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-gray-900 bg-gradient-to-r from-[#fec832] to-[#fec832]/80 shadow-md animate-pulse">
                  <MapPin className="h-4 w-4 text-store-pink" />
                  Entrega Grátis acima de R$ {settings.freeDeliveryThreshold}
                </div>
              </div>
            )
          )}
        </div>

        {/* Filtro de categorias - aparece apenas se houver categorias definidas */}
        {categories.length > 0 && (
          <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-gray-700">Filtrar por categoria:</h3>
            <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory(null)} 
                className={selectedCategory === null ? "bg-gradient-to-r from-store-pink to-store-pink/80 hover:bg-store-pink/90 whitespace-nowrap" : "whitespace-nowrap"}
              >
                Todos os Produtos
              </Button>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setSelectedCategory(category)} 
                  className={`${selectedCategory === category ? "bg-gradient-to-r from-store-pink to-store-pink/80 hover:opacity-90" : ""} whitespace-nowrap`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Grade de produtos */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {/* Mensagem quando não há produtos na categoria selecionada */}
        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
            <p className="text-lg text-gray-500">Nenhum produto encontrado nesta categoria.</p>
            <Button 
              onClick={() => setSelectedCategory(null)} 
              variant="outline" 
              className="mt-4"
            >
              Ver todos os produtos
            </Button>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
