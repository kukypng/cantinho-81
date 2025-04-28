
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight } from "lucide-react";
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
        <header className="sticky top-0 z-10 apple-glass">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-medium tracking-tight text-gradient">{settings.storeName}</span>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="hidden space-x-8 md:flex">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium tracking-wide transition-colors hover:text-store-pink"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-4">
              <div className="relative">
                <Link to="/cart" className="relative hover:scale-105 transition-transform duration-300">
                  <ShoppingCart className="h-6 w-6 stroke-[1.5px]" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-pink text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
                {totalItems > 0 && (
                  <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
                    <div className="flex items-center gap-1 bg-store-pink/10 px-3 py-1 rounded-full text-store-pink shadow-sm animate-pulse">
                      <span className="text-xs font-medium">Clique Aqui</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                )}
              </div>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:text-store-pink">
                      <Menu className="h-5 w-5 stroke-[1.5px]" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="apple-glass border-l border-border">
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

          {settings.welcomeMessage && (
            <div className="bg-store-light-pink/30 p-2 text-center text-sm font-medium tracking-wide text-store-pink">
              {settings.welcomeMessage}
            </div>
          )}
        </header>
      )}

      <main className={cn("flex-1 px-4 py-6 md:py-8", !showHeader && "pt-0")}>
        <div className="container animate-fade-in">
          {children}
        </div>
      </main>

      {showFooter && (
        <footer className="border-t border-border/40 bg-background py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-foreground/80 tracking-wide">
              {settings.footerMessage}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {settings.storeName} &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default StoreLayout;
