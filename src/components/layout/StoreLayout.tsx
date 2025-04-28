
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
    <div className="flex min-h-screen flex-col">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-store-pink shadow-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">{settings.storeName}</span>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="hidden space-x-6 md:flex">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-white/80"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-4">
              <div className="relative">
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-yellow text-xs font-bold text-black">
                      {totalItems}
                    </span>
                  )}
                </Link>
                {totalItems > 0 && (
                  <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
                    <div className="flex items-center gap-2 bg-store-yellow/10 px-3 py-1 rounded-lg shadow-lg animate-pulse">
                      <span className="text-sm font-medium">Clique Aqui</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                )}
              </div>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="flex flex-col gap-4 pt-10">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-lg font-medium"
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
            <div className="bg-transparent p-2 text-center text-sm font-medium text-white">
              {settings.welcomeMessage}
            </div>
          )}
        </header>
      )}

      <main className={cn("flex-1 bg-white", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-gray-100 bg-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-500">
              {settings.footerMessage}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {settings.storeName} &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default StoreLayout;
