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
}) => <div className="mt-4 flex justify-center space-x-4">
    {socialMedia?.instagram && <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-store-pink p-2 text-white hover:bg-store-pink/90 transition-colors" aria-label="Instagram">
        <Instagram size={20} />
      </a>}
    {socialMedia?.whatsapp && <a href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 p-2 text-white hover:bg-green-700 transition-colors" aria-label="WhatsApp">
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
  return <div className="flex min-h-screen flex-col">
      {showHeader && <header className="sticky top-0 z-10 bg-store-pink shadow-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-white">{settings.storeName}</span>
              </Link>
            </div>
            
            <NavigationLinks isMobile={isMobile} />

            <div className="flex items-center gap-4">
              <div className="relative">
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-white" />
                  {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-yellow text-xs font-bold text-black">
                      {totalItems}
                    </span>}
                </Link>
                {totalItems > 0 && <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
                    <div className="flex items-center gap-2 px-3 py-1 shadow-lg animate-pulse rounded-lg bg-[mb-6_rounded-xl_bg-gradient-to-r_from-store-pink/5_to-store-pink/10_p-6] bg-[#fec832]/[0.72]">
                      <span className="text-sm font-medium text-white">Clique Aqui</span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </Link>}
              </div>
              
              {isMobile && <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="flex flex-col gap-4 pt-10">
                      {navigationItems.map(item => <Link key={item.name} to={item.href} className="text-lg font-medium">
                          {item.name}
                        </Link>)}
                    </nav>
                  </SheetContent>
                </Sheet>}
            </div>
          </div>

          {settings.welcomeMessage && <div className="bg-transparent p-2 text-center text-sm font-medium text-white">
              {settings.welcomeMessage}
            </div>}
        </header>}

      <main className={cn("flex-1 bg-white", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && <footer className="border-t border-gray-100 bg-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-500">
              {settings.footerMessage}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {settings.storeName} &copy; {new Date().getFullYear()}
            </p>
            
            <SocialMediaLinks socialMedia={settings.socialMedia} />
          </div>
        </footer>}
    </div>;
});
StoreLayout.displayName = "StoreLayout";
export default StoreLayout;