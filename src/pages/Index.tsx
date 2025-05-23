import React, { useState, useEffect } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { MapPin, BellRing, Search, X, Gamepad2 } from "lucide-react";
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
  const {
    products
  } = useProducts();

  // Obtém as configurações da loja do contexto
  const {
    settings
  } = useStore();

  // Obtém informações de autenticação
  const {
    isAdmin
  } = useAuth();

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
    const searchMatch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()) || product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return categoryMatch && searchMatch;
  });
  return <StoreLayout>
      <div className="container max-w-7xl mx-auto px-3 py-4 sm:py-6">
        {/* Barra de pesquisa */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="text" placeholder="Pesquisar produtos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 rounded-full shadow-md hover:shadow-lg transition-shadow text-sm h-10" />
            {searchTerm && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setSearchTerm("")}>
                <X size={14} />
              </button>}
          </div>
        </div>
        
        {/* Easter Egg - Aparece apenas quando pesquisar "cookie" */}
        {showEasterEgg && <div className="mb-4 sm:mb-6 animate-fade-in">
            <Alert className="bg-gradient-to-r from-indigo-50 to-purple-50 border-store-pink/20 shadow-md hover:shadow-lg transition-all">
              <Gamepad2 className="h-5 w-5 text-store-pink bounce-gentle" />
              <AlertTitle className="text-store-pink font-medium flex items-center gap-2">
                Easter Egg encontrado!
              </AlertTitle>
              <AlertDescription className="text-gray-700">
                <p className="mb-2">Você encontrou um jogo secreto :D</p>
                <Link to="/easteregg">
                  <Button size="sm" className="mt-1 bg-gradient-to-r from-store-pink to-store-purple shadow-md hover:shadow-xl transition-all">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Jogar Agora
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          </div>}
        
        {/* Área de avisos personalizados */}
        <div className="mb-4 sm:mb-6 rounded-xl bg-gray-50 p-3 sm:p-4 space-y-3">
          {settings.announcements && settings.announcements.length > 0 ? settings.announcements.map((announcement, index) => <Alert key={index} className="bg-white border-store-pink/20 animate-fade-in hover-scale transition-all shadow-pop">
                <BellRing className="h-4 w-4 text-store-pink animate-bounce-subtle" />
                <AlertTitle className="text-store-pink font-medium">Aviso</AlertTitle>
                <AlertDescription className="text-gray-700 text-sm">
                  {announcement}
                </AlertDescription>
              </Alert>) :
        // Exibe o banner de entrega grátis apenas se estiver ativado nas configurações
        settings.showFreeDeliveryBanner && settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900 bg-store-yellow shadow-md animate-bounce-subtle">
                  <MapPin className="h-4 w-4 text-store-pink" />
                  {settings.freeDeliveryMessage || `Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold}`}
                </div>
              </div>}
        </div>

        {/* Filtro de categorias - aparece apenas se houver categorias definidas */}
        {categories.length > 0 && <div className="mb-4 sm:mb-6 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)} className={`whitespace-nowrap text-xs px-3 h-8 ${selectedCategory === null ? "shadow-md bg-store-pink" : ""}`}>
              Todos
            </Button>
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap text-xs px-3 h-8 ${selectedCategory === category ? "shadow-md bg-store-pink" : ""}`}>
                {category}
              </Button>)}
          </div>}

        {/* Grade de produtos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {/* Mensagem quando não há produtos na categoria selecionada */}
        {filteredProducts.length === 0 && <div className="mt-8 sm:mt-12 text-center py-6 sm:py-8">
            <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
            <Button variant="outline" onClick={() => {
          setSelectedCategory(null);
          setSearchTerm("");
        }} className="mt-4">
              Limpar filtros
            </Button>
          </div>}
      </div>
    </StoreLayout>;
};
export default Index;