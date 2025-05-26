
import React, { useState, useEffect } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin, BellRing, Search, X, Gamepad2, Sparkles } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Página inicial da loja
 * 
 * Esta é a página principal que os clientes verão quando visitarem o site
 * Exibe o catálogo de produtos, filtros de categoria e informações da loja
 */
const Index = () => {
  // Obtém a lista de produtos do contexto
  const { products } = useProducts();

  // Obtém as configurações da loja do contexto
  const { settings } = useStore();

  // Obtém informações de autenticação
  const { isAdmin } = useAuth();

  // Obter parâmetros de URL para pesquisa
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search');

  // Estado para armazenar a categoria selecionada no filtro
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estado para armazenar o termo de busca
  const [searchTerm, setSearchTerm] = useState(searchParam || "");

  // Estado para controlar o easter egg
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Atualizar searchTerm quando o parâmetro de URL mudar
  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  // Verificar se o termo de busca é "cookie" para mostrar o easter egg
  useEffect(() => {
    if (searchTerm.toLowerCase() === "cookie") {
      setShowEasterEgg(true);
    } else {
      setShowEasterEgg(false);
    }
  }, [searchTerm]);

  // Extrai todas as categorias únicas dos produtos
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));

  // Filtra os produtos pela categoria selecionada e termo de busca
  const filteredProducts = products.filter(product => {
    // Filtro por categoria
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;

    // Filtro por termo de busca
    const searchMatch = searchTerm ? 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    
    return categoryMatch && searchMatch;
  });

  return (
    <StoreLayout>
      <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header Section com gradiente */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-store-pink via-store-purple to-store-blue bg-clip-text text-transparent mb-2">
            {settings.storeName}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra sabores únicos e deliciosos em nossa seleção especial de doces artesanais
          </p>
        </div>

        {/* Barra de pesquisa melhorada */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              type="text" 
              placeholder="Pesquisar produtos deliciosos..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-12 pr-12 rounded-full shadow-lg hover:shadow-xl transition-all text-base h-12 border-2 border-gray-100 focus:border-store-pink" 
            />
            {searchTerm && (
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100" 
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Easter Egg melhorado */}
        {showEasterEgg && (
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <Alert className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-store-pink/30 shadow-xl max-w-lg mx-auto">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-store-pink to-store-purple rounded-full">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-store-pink font-bold flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5" />
                    Easter Egg Descoberto!
                  </AlertTitle>
                  <AlertDescription className="text-gray-700 mb-3">
                    Parabéns! Você encontrou nosso jogo secreto de quebra-cabeça deslizante!
                  </AlertDescription>
                  <Link to="/easteregg">
                    <Button className="bg-gradient-to-r from-store-pink via-store-purple to-store-blue shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Jogar Agora
                    </Button>
                  </Link>
                </div>
              </div>
            </Alert>
          </div>
        )}
        
        {/* Área de avisos melhorada */}
        <div className="mb-6 sm:mb-8">
          {settings.announcements && settings.announcements.length > 0 ? (
            <div className="space-y-4">
              {settings.announcements.map((announcement, index) => (
                <Alert key={index} className="bg-white border-2 border-store-pink/20 animate-fade-in hover:shadow-lg transition-all max-w-4xl mx-auto">
                  <BellRing className="h-5 w-5 text-store-pink" />
                  <AlertTitle className="text-store-pink font-bold">Aviso Importante</AlertTitle>
                  <AlertDescription className="text-gray-700">
                    {announcement}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            settings.showFreeDeliveryBanner && settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-bold text-gray-900 bg-gradient-to-r from-store-yellow to-yellow-300 shadow-lg hover:shadow-xl transition-all">
                  <MapPin className="h-5 w-5 text-store-pink" />
                  {settings.freeDeliveryMessage || `🚚 Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold}`}
                </div>
              </div>
            )
          )}
        </div>

        {/* Filtro de categorias melhorado */}
        {categories.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none max-w-full">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                onClick={() => setSelectedCategory(null)} 
                className={`whitespace-nowrap text-sm px-6 py-2 rounded-full transition-all ${
                  selectedCategory === null 
                    ? "bg-gradient-to-r from-store-pink to-store-purple shadow-lg text-white" 
                    : "hover:border-store-pink hover:text-store-pink"
                }`}
              >
                Todos os Produtos
              </Button>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"} 
                  onClick={() => setSelectedCategory(category)} 
                  className={`whitespace-nowrap text-sm px-6 py-2 rounded-full transition-all ${
                    selectedCategory === category 
                      ? "bg-gradient-to-r from-store-pink to-store-purple shadow-lg text-white" 
                      : "hover:border-store-pink hover:text-store-pink"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Grade de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mensagem quando não há produtos */}
        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-store-pink/10 to-store-purple/10 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600 mb-6">
                Não encontramos produtos que correspondam à sua pesquisa ou filtros.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm("");
                }} 
                className="border-2 border-store-pink text-store-pink hover:bg-store-pink hover:text-white transition-all"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
