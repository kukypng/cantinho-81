
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, LockKeyhole } from "lucide-react";
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
        <header className="sticky top-0 z-10 bg-gradient-to-r from-store-pink to-store-light-pink text-white shadow-lg backdrop-blur-lg">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold tracking-tight">{settings.storeName}</span>
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
              <Link to="/login" className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-lg transition-all hover:bg-white/20">
                <LockKeyhole className="h-4 w-4" />
                <span>Admin</span>
              </Link>
              
              <div className="relative flex flex-col items-center">
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-store-pink">
                      {totalItems}
                    </span>
                  )}
                </Link>
                {totalItems > 0 && (
                  <div className="absolute top-full mt-2 whitespace-nowrap">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-store-pink shadow-lg animate-pulse">
                      <span className="text-sm font-medium">Clique aqui</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="backdrop-blur-lg bg-gray-900/95 text-white border-gray-800">
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
                      <Link to="/login" className="flex items-center gap-2 text-lg font-medium">
                        <LockKeyhole className="h-4 w-4" />
                        Admin
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>

          {settings.welcomeMessage && (
            <div className="bg-white/5 p-2 text-center text-sm font-medium backdrop-blur-lg">
              {settings.welcomeMessage}
            </div>
          )}
        </header>
      )}

      <main className={cn("flex-1", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-store-pink/10 bg-gradient-to-r from-store-pink/5 to-store-light-pink/5 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-store-pink">
              {settings.footerMessage || "Produtos feitos com ❤️"}
            </p>
            <p className="mt-1 text-xs text-store-pink/70">
              {settings.storeName} &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default StoreLayout;
