
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
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

const StoreLayout: React.FC<StoreLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  const { totalItems } = useCart();
  const { settings } = useStore();
  const isMobile = useIsMobile();

  const navigationItems = [
    { name: "Início", href: "/" },
    { name: "Carrinho", href: "/cart" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-store-pink">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-medium text-white">{settings.storeName}</span>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="hidden space-x-8 md:flex">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-white tracking-wide transition-colors hover:text-white/80"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-4">
              <Link to="/cart" className="text-white hover:text-white/80 transition-colors">
                <ShoppingCart className="h-6 w-6" />
              </Link>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="border-l border-store-light-pink/50">
                    <nav className="flex flex-col gap-6 pt-12">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-lg font-medium tracking-wide transition-colors hover:text-store-pink"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={cn("flex-1", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && (
        <footer className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            {settings.footerMessage}
          </p>
        </footer>
      )}
    </div>
  );
};

export default StoreLayout;
