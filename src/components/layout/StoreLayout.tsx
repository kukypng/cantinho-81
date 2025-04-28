
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

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

  React.useEffect(() => {
    if (totalItems > 0) {
      toast.success(
        <div className="cursor-pointer" onClick={() => window.location.href = "/cart"}>
          Produto adicionado! <span className="font-bold underline">Clique aqui</span> para finalizar sua compra!
        </div>,
        {
          id: "cart-notification",
          duration: 5000,
        }
      );
    }
  }, [totalItems]);

  const navigationItems = [
    { name: "Início", href: "/" },
    { name: "Carrinho", href: "/cart" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-store-pink to-store-pink/90 text-white shadow-md">
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
                      <Link to="/login" className="text-lg font-medium">
                        Admin
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>

          {settings.welcomeMessage && (
            <div className="bg-white/10 p-2 text-center text-sm font-medium">
              {settings.welcomeMessage}
            </div>
          )}
        </header>
      )}

      <main className={cn("flex-1", !showHeader && "pt-0")}>
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-gray-100 bg-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-500">
              {settings.footerMessage || "Produtos feitos com ❤️"}
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
