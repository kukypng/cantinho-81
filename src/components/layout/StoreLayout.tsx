
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Instagram, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
      {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-sm font-medium text-white transition-all hover:text-white/80 hover-scale">
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
    {socialMedia?.instagram && <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-tr from-store-pink to-store-blue p-2 text-white hover:opacity-90 transition-all shadow-md bounce-subtle" aria-label="Instagram">
        <Instagram size={20} />
      </a>}
    {socialMedia?.whatsapp && <a href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-tr from-green-500 to-green-700 p-2 text-white hover:opacity-90 transition-all shadow-md bounce-subtle" aria-label="WhatsApp">
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
  
  return <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Cabeçalho da loja - pode ser ocultado com a prop showHeader=false */}
      {showHeader && <header className="sticky top-0 z-10 animate-fade-in shadow-md">
          <div className="header-gradient py-4">
            <div className="container mx-auto flex items-center justify-between px-4">
              {/* Logo e nome da loja */}
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
                  <span className="text-xl md:text-2xl font-bold text-white">{settings.storeName}</span>
                </Link>
              </div>
              
              {/* Links de navegação - aparece apenas em desktop */}
              <NavigationLinks isMobile={isMobile} />

              {/* Carrinho e menu móvel */}
              <div className="flex items-center gap-4">
                {/* Ícone do carrinho com contador */}
                <div className="relative">
                  <Link to="/cart" className="relative hover-scale">
                    <ShoppingCart className="h-6 w-6 text-white" />
                    {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-yellow text-xs font-bold text-black shadow-sm pulse-soft">
                        {totalItems}
                      </span>}
                  </Link>
                  {/* Dica visual quando há itens no carrinho */}
                  {totalItems > 0 && <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap hidden md:block">
                      <div className="flex items-center gap-2 px-3 py-1 shadow-lg animate-pulse rounded-full bg-gradient-to-r from-store-yellow to-store-yellow/80">
                        <span className="text-sm font-medium text-black">Finalizar</span>
                        <ArrowRight className="h-4 w-4 text-black" />
                      </div>
                    </Link>}
                </div>
                
                {/* Menu móvel - aparece apenas em dispositivos móveis */}
                {isMobile && <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="glass-morphism border-l border-gray-100">
                      <nav className="flex flex-col gap-4 pt-10">
                        {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-lg font-medium text-gradient hover-scale slide-in">
                            {item.name}
                          </Link>)}
                      </nav>
                      
                      {/* Add social media links in mobile menu too */}
                      <div className="mt-8">
                        <SocialMediaLinks socialMedia={settings.socialMedia} />
                      </div>
                    </SheetContent>
                  </Sheet>}
              </div>
            </div>
          </div>

          {/* Mensagem de boas-vindas - configurada nas configurações da loja */}
          {settings.welcomeMessage && <div className="bg-gradient-to-r from-store-pink/10 to-store-blue/10 p-3 text-center text-sm font-medium text-gray-800 animate-fade-in shadow-sm">
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
      {showFooter && <footer className="border-t border-gray-100 py-8 glass-morphism">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gradient text-lg font-medium">
              {settings.storeName}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {settings.footerMessage}
            </p>
            <p className="mt-1 text-xs text-gray-500">
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
