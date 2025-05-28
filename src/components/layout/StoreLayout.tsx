
import React, { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Instagram, Phone, Search, X, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/context/ProductContext";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";

// Interface que define as propriedades do componente StoreLayout
interface StoreLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

// Itens de navegação definidos fora do componente para melhorar performance
const navigationItems = [{
  name: "Início",
  href: "/"
}, {
  name: "Carrinho",
  href: "/cart"
}];

// Componente de links de navegação (memoizado para melhor performance)
const NavigationLinks = memo(({
  isMobile
}: {
  isMobile: boolean;
}) => !isMobile && <nav className="hidden space-x-8 md:flex">
      {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-sm font-medium text-gray-700 transition-all duration-300 hover:text-store-pink hover:scale-105 py-2 px-1 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-store-pink after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
          {item.name}
        </Link>)}
    </nav>);
NavigationLinks.displayName = "NavigationLinks";

// Componente de links para redes sociais (memoizado para melhor performance)
const SocialMediaLinks = memo(({
  socialMedia
}: {
  socialMedia: any;
}) => <div className="mt-8 flex justify-center space-x-6">
    {socialMedia?.instagram && <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-3 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg" aria-label="Instagram">
        <Instagram size={20} className="relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </a>}
    {socialMedia?.whatsapp && <a href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-green-600 p-3 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg" aria-label="WhatsApp">
        <Phone size={20} className="relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </a>}
  </div>);
SocialMediaLinks.displayName = "SocialMediaLinks";

/**
 * Componente SearchBar aprimorado para busca de produtos
 */
const SearchBar = () => {
  const {
    products
  } = useProducts();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Filtra produtos com base na consulta de pesquisa
  const filteredProducts = searchQuery ? products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase()) || product.category?.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  
  return <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-[280px] md:max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 rounded-full border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-store-pink/20 focus:border-store-pink text-sm h-10"
            />
            {searchQuery && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" onClick={e => {
              e.stopPropagation();
              setSearchQuery("");
            }}>
                <X size={14} />
              </button>}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[320px] md:w-[380px] shadow-xl border-0 bg-white/95 backdrop-blur-md" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Digite para pesquisar produtos..." value={searchQuery} onValueChange={setSearchQuery} className="h-9 border-0" />
          <CommandEmpty className="py-4 text-center text-gray-500">Nenhum produto encontrado.</CommandEmpty>
          {filteredProducts.length > 0 && <CommandGroup heading="Produtos" className="p-2">
              {filteredProducts.slice(0, 6).map(product => <CommandItem key={product.id} onSelect={() => {
            navigate(`/product/${product.id}`);
            setOpen(false);
            setSearchQuery("");
          }} className="flex items-center gap-3 py-3 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={product.imageUrl || "https://placehold.co/100x100"} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate">{product.category}</p>
                  </div>
                  <div className="text-sm font-semibold text-store-pink">
                    R$ {product.price.toFixed(2)}
                  </div>
                </CommandItem>)}
              {filteredProducts.length > 6 && <div className="px-2 pb-2 pt-1">
                  <Button variant="link" size="sm" className="w-full text-xs text-store-pink hover:text-store-pink/80" onClick={() => {
              navigate(`/?search=${encodeURIComponent(searchQuery)}`);
              setOpen(false);
              setSearchQuery("");
            }}>
                    Ver todos os {filteredProducts.length} resultados
                  </Button>
                </div>}
            </CommandGroup>}
        </Command>
      </PopoverContent>
    </Popover>;
};

/**
 * Componente principal de layout da loja
 */
const StoreLayout: React.FC<StoreLayoutProps> = memo(({
  children,
  showHeader = true,
  showFooter = true
}) => {
  // Obtém informações do carrinho (número de itens)
  const {
    totalItems
  } = useCart();

  // Obtém configurações da loja (nome, mensagens, redes sociais)
  const {
    settings
  } = useStore();

  // Obtém informações de autenticação
  const {
    isAdmin
  } = useAuth();

  // Verifica se o dispositivo é móvel para adaptar o layout
  const isMobile = useIsMobile();
  
  return <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50">
      {/* Cabeçalho da loja - melhorado com design mais moderno */}
      {showHeader && <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-100/50 shadow-sm">
          <div className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
              {/* Logo e nome da loja - melhorado */}
              <div className="flex items-center gap-3">
                <Link to="/" className="group flex items-center transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF1B8D] via-[#9747FF] to-[#2187FF] bg-clip-text text-transparent drop-shadow-sm">
                      {settings.storeName}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF1B8D] via-[#9747FF] to-[#2187FF] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                  </div>
                </Link>
              </div>
              
              {/* Links de navegação - melhorados */}
              <NavigationLinks isMobile={isMobile} />

              {/* Barra de pesquisa aprimorada */}
              {!isMobile && <div className="hidden md:flex items-center max-w-xs w-full mx-6">
                  <SearchBar />
                </div>}

              {/* Carrinho e menu móvel - melhorados */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Barra de pesquisa em dispositivos móveis */}
                {isMobile && <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-store-pink hover:bg-gray-100 rounded-full transition-all duration-300">
                        <Search className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-3 w-[90vw] max-w-sm shadow-xl bg-white/95 backdrop-blur-md" side="bottom" align="end">
                      <SearchBar />
                    </PopoverContent>
                  </Popover>}

                {/* Ícone do carrinho com contador - melhorado */}
                <div className="relative">
                  <Link to="/cart" className="group relative transition-transform duration-300 hover:scale-105">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-2.5 sm:p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group-hover:from-store-pink/10 group-hover:to-store-purple/10">
                      <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-store-pink transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {totalItems > 0 && <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-r from-store-pink to-store-purple text-[0.7rem] sm:text-xs font-bold text-white shadow-lg animate-pulse border-2 border-white">
                        {totalItems}
                      </span>}
                  </Link>
                  {/* Dica visual quando há itens no carrinho - melhorada */}
                  {totalItems > 0 && <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap z-10">
                      <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 shadow-xl animate-pulse rounded-full bg-gradient-to-r from-store-pink via-store-purple to-store-blue hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <span className="text-xs sm:text-sm font-semibold text-white">Finalizar</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-bounce" />
                      </div>
                    </Link>}
                </div>
                
                {/* Menu móvel - melhorado */}
                {isMobile && <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-store-pink hover:bg-gray-100 rounded-full transition-all duration-300 p-2">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-l border-gray-100">
                      <nav className="flex flex-col gap-6 pt-12">
                        {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-lg font-medium text-gray-700 hover:text-store-pink transition-all duration-300 hover:translate-x-2 py-2">
                            {item.name}
                          </Link>)}
                          
                        {/* Botão de acesso à área administrativa */}
                        <Link to="/admin" className="flex items-center gap-3 text-lg font-medium text-gray-500 hover:text-store-pink transition-all duration-300 hover:translate-x-2 py-2">
                          <Lock className="h-5 w-5" />
                          Área Admin
                        </Link>
                      </nav>
                    </SheetContent>
                  </Sheet>}
              </div>
            </div>

          {/* Mensagem de boas-vindas - melhorada */}
          {settings.welcomeMessage && <div className="bg-gradient-to-r from-store-pink/10 via-store-purple/10 to-store-blue/10 border-t border-gray-100/50 p-3 sm:p-4 text-center text-sm sm:text-base font-medium text-gray-800 backdrop-blur-sm">
              <div className="container mx-auto">
                {settings.welcomeMessage}
              </div>
            </div>}
        </header>}

      {/* Conteúdo principal */}
      <main className={cn("flex-1 relative", !showHeader && "pt-0")}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Rodapé da loja - melhorado */}
      {showFooter && <footer className="border-t border-gray-100/50 py-8 sm:py-12 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF1B8D] via-[#9747FF] to-[#2187FF] bg-clip-text text-transparent">
                {settings.storeName}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                {settings.footerMessage}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                &copy; {new Date().getFullYear()} - Todos os direitos reservados
              </p>
            </div>
            
            {/* Links para redes sociais - melhorados */}
            <SocialMediaLinks socialMedia={settings.socialMedia} />
          </div>
        </footer>}
    </div>;
});
StoreLayout.displayName = "StoreLayout";
export default StoreLayout;
