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
    { name: "Carrinho", href: "/cart" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-store-pink/10 shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-medium tracking-tight text-store-pink">{settings.storeName}</span>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="hidden space-x-6 md:flex">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-store-pink"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-4">
              <Link to="/login" className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-store-pink transition-colors">
                Clique aqui
              </Link>
              
              <div className="relative flex flex-col items-center">
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-store-pink transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-pink text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
                {totalItems > 0 && (
                  <div className="absolute top-full mt-2 whitespace-nowrap">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-store-pink shadow-lg animate-pulse border border-store-pink/10">
                      <span className="text-sm font-medium">Clique aqui</span>
                    </div>
                  </div>
                )}
              </div>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-700 hover:text-store-pink">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="backdrop-blur-lg bg-white/95 border-store-pink/10">
                    <nav className="flex flex-col gap-4 pt-10">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-lg font-medium text-gray-700 hover:text-store-pink"
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
            <div className="bg-store-pink/5 p-2 text-center text-sm font-medium text-gray-700">
              {settings.welcomeMessage}
            </div>
          )}
        </header>
      )}

      <main className={cn("flex-1", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-store-pink/10 bg-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-600">
              {settings.footerMessage || "Produtos feitos com ❤️"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {settings.storeName} &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default StoreLayout;
