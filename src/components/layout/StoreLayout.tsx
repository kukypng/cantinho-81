
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, MapPin } from "lucide-react";
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
        <header className="sticky top-0 z-10 bg-store-pink text-white shadow-md">
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
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-yellow text-xs font-bold text-black">
                    {totalItems}
                  </span>
                )}
              </Link>
              
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
            <div className="bg-stone-100 p-2 text-center text-sm font-medium text-gray-700">
              {settings.welcomeMessage}
            </div>
          )}

          {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
            <div className="flex items-center justify-center gap-1 bg-store-yellow p-2 text-center text-sm font-medium text-black">
              <MapPin className="h-4 w-4" />
              <span>Entrega Grátis em pedidos acima de R$ {settings.freeDeliveryThreshold.toFixed(2)}</span>
            </div>
          )}
        </header>
      )}

      <main className={cn("flex-1", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-gray-200 bg-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4 text-sm text-gray-500">
              {settings.footerMessage || "Produtos feitos com ❤️"}
            </p>
            <p className="text-sm text-gray-400">
              {settings.storeName} &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default StoreLayout;
