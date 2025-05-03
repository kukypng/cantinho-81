import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Instagram, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
interface StoreLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

// Navigation items defined outside component to prevent recreation on each render
const navigationItems = [{
  name: "Início",
  href: "/"
}, {
  name: "Carrinho",
  href: "/cart"
}];

// Memoize navigation links to prevent unnecessary re-renders
const NavigationLinks = memo(({
  isMobile
}: {
  isMobile: boolean;
}) => !isMobile && <nav className="hidden space-x-6 md:flex">
      {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-sm font-medium text-white transition-colors hover:text-white/80">
          {item.name}
        </Link>)}
    </nav>);
NavigationLinks.displayName = "NavigationLinks";

// Memoize social media links to prevent unnecessary re-renders
const SocialMediaLinks = memo(({
  socialMedia
}: {
  socialMedia: any;
}) => <div className="mt-6 flex justify-center space-x-4">
    {socialMedia?.instagram && <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-tr from-store-pink to-store-blue p-2 text-white hover:opacity-90 transition-all shadow-md" aria-label="Instagram">
        <Instagram size={20} />
      </a>}
    {socialMedia?.whatsapp && <a href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-tr from-green-500 to-green-700 p-2 text-white hover:opacity-90 transition-all shadow-md" aria-label="WhatsApp">
        <Phone size={20} />
      </a>}
  </div>);
SocialMediaLinks.displayName = "SocialMediaLinks";

// Main component - memoized to prevent unnecessary re-renders
const StoreLayout: React.FC<StoreLayoutProps> = memo(({
  children,
  showHeader = true,
  showFooter = true
}) => {
  const {
    totalItems
  } = useCart();
  const {
    settings
  } = useStore();
  const isMobile = useIsMobile();
  return <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-gray-50">
      {showHeader && <header className="sticky top-0 z-10 glass-morphism animate-fade-in">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
                <span className="text-xl font-bold text-gradient">{settings.storeName}</span>
              </Link>
            </div>
            
            <NavigationLinks isMobile={isMobile} />

            <div className="flex items-center gap-4">
              <div className="relative">
                <Link to="/cart" className="relative hover-scale">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-yellow text-xs font-bold text-black shadow-sm">
                      {totalItems}
                    </span>}
                </Link>
                {totalItems > 0 && <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
                    <div className="flex items-center gap-2 px-3 py-1 shadow-lg animate-pulse rounded-full bg-gradient-to-r from-store-pink/90 to-store-pink/70">
                      <span className="text-sm font-medium text-white">Aqui</span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </Link>}
              </div>
              
              {isMobile && <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="glass-morphism border-l border-gray-100">
                    <nav className="flex flex-col gap-4 pt-10">
                      {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-lg font-medium text-gradient hover-scale">
                          {item.name}
                        </Link>)}
                    </nav>
                  </SheetContent>
                </Sheet>}
            </div>
          </div>

          {settings.welcomeMessage && <div className="bg-gradient-to-r from-store-pink/10 to-store-blue/10 p-3 text-center text-sm font-medium text-gray-800 animate-fade-in shadow-sm">
              {settings.welcomeMessage}
            </div>}
        </header>}

      <main className={cn("flex-1", !showHeader && "pt-0")}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

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
            
            <SocialMediaLinks socialMedia={settings.socialMedia} />
          </div>
        </footer>}
    </div>;
});
StoreLayout.displayName = "StoreLayout";
export default StoreLayout;