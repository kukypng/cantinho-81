
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Instagram, Phone, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
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
}) => !isMobile && <nav className="hidden space-x-6 md:flex">
      {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-sm font-medium text-store-pink transition-colors hover:text-store-pink/80 hover:underline py-1 btn-pop">
          {item.name}
        </Link>)}
    </nav>);
NavigationLinks.displayName = "NavigationLinks";

// Componente de links para redes sociais (memoizado para melhor performance)
const SocialMediaLinks = memo(({
  socialMedia
}: {
  socialMedia: any;
}) => <div className="mt-6 flex justify-center space-x-4">
    {socialMedia?.instagram && <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-store-pink p-2 text-white hover:opacity-90 transition-all shadow-md hover:scale-105" aria-label="Instagram">
        <Instagram size={20} />
      </a>}
    {socialMedia?.whatsapp && <a href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500 p-2 text-white hover:opacity-90 transition-all shadow-md hover:scale-105" aria-label="WhatsApp">
        <Phone size={20} />
      </a>}
  </div>);
SocialMediaLinks.displayName = "SocialMediaLinks";

/**
 * Componente principal de layout da loja
 * Este componente contém o cabeçalho e rodapé da loja
 * É usado em todas as páginas públicas do site
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
  
  // Verifica se o dispositivo é móvel para adaptar o layout
  const isMobile = useIsMobile();
  
  // Obtém informações de autenticação
  const { isAdmin } = useAuth();
  
  return <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Cabeçalho da loja - pode ser ocultado com a prop showHeader=false */}
      {showHeader && <header className="sticky top-0 z-10 animate-fade-in shadow-md">
          <div className="bg-white py-1 border-b">
            <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
              {/* Logo e nome da loja */}
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#FF1B8D] to-[#9747FF] bg-clip-text text-transparent drop-shadow-sm">{settings.storeName}</span>
                </Link>
              </div>
              
              {/* Links de navegação - aparece apenas em desktop */}
              <NavigationLinks isMobile={isMobile} />

              {/* Carrinho e menu móvel */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Botão de área administrativa - adicionado ao lado do carrinho */}
                {isAdmin && (
                  <Link to="/admin" className="relative btn-pop">
                    <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full shadow-sm">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-store-pink" />
                    </div>
                  </Link>
                )}
                
                {/* Ícone do carrinho com contador */}
                <div className="relative">
                  <Link to="/cart" className="relative btn-pop">
                    <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full shadow-sm">
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-store-pink" />
                    </div>
                    {totalItems > 0 && <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-store-pink text-[0.65rem] sm:text-xs font-bold text-white shadow-sm animate-bounce-subtle">
                        {totalItems}
                      </span>}
                  </Link>
                  {/* Dica visual quando há itens no carrinho - Visível em TODOS os dispositivos */}
                  {totalItems > 0 && <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
                      <div className="flex items-center gap-2 px-2 sm:px-3 py-0.5 sm:py-1 shadow-lg animate-pulse rounded-full bg-store-pink">
                        <span className="text-xs sm:text-sm font-medium text-white">Finalizar</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </Link>}
                </div>
                
                {/* Menu móvel - aparece apenas em dispositivos móveis */}
                {isMobile && <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-store-pink hover:bg-gray-100 btn-pop p-1.5">
                        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="glass-morphism border-l border-gray-100">
                      <nav className="flex flex-col gap-4 pt-10">
                        {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-lg font-medium text-gradient hover-scale btn-pop">
                            {item.name}
                          </Link>)}
                      </nav>
                    </SheetContent>
                  </Sheet>}
              </div>
            </div>
          </div>

          {/* Mensagem de boas-vindas - configurada nas configurações da loja */}
          {settings.welcomeMessage && <div className="bg-gray-100 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-800 animate-fade-in shadow-sm">
              {settings.welcomeMessage}
            </div>}
        </header>}

      {/* Conteúdo principal */}
      <main className={cn("flex-1", !showHeader && "pt-0")}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Rodapé da loja - pode ser ocultado com a prop showFooter=false */}
      {showFooter && <footer className="border-t border-gray-100 py-6 sm:py-8 glass-morphism">
          <div className="container mx-auto px-4 text-center">
            <p className="bg-gradient-to-r from-[#FF1B8D] to-[#9747FF] bg-clip-text text-transparent text-base sm:text-lg font-medium">
              {settings.storeName}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              {settings.footerMessage}
            </p>
            <p className="mt-1 text-[0.65rem] sm:text-xs text-gray-500">
              &copy; {new Date().getFullYear()}
            </p>
            
            {/* Links para redes sociais - configurados nas configurações da loja */}
            <SocialMediaLinks socialMedia={settings.socialMedia} />
          </div>
        </footer>}
    </div>;
});
StoreLayout.displayName = "StoreLayout";
export default StoreLayout;
