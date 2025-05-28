
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Search, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import NavigationLinks from "./NavigationLinks";
import SearchBar from "./SearchBar";
import MobileSearch from "./MobileSearch";

const Header = memo(() => {
  const { totalItems } = useCart();
  const { settings } = useStore();
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 animate-fade-in shadow-md">
      <div className="bg-white py-1 border-b">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
          {/* Logo and store name */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#FF1B8D] to-[#9747FF] bg-clip-text text-transparent drop-shadow-sm shine-effect">
                {settings.storeName}
              </span>
            </Link>
          </div>
          
          {/* Navigation links - desktop only */}
          <NavigationLinks isMobile={isMobile} />

          {/* Search bar - desktop only */}
          {!isMobile && (
            <div className="hidden md:flex items-center max-w-xs w-full mx-4">
              <SearchBar />
            </div>
          )}

          {/* Cart and mobile menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile search */}
            {isMobile && <MobileSearch />}

            {/* Cart icon with counter */}
            <div className="relative">
              <Link to="/cart" className="relative btn-pop">
                <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full shadow-sm hover:bg-gray-200 transition-colors">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-store-pink" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-store-pink text-[0.65rem] sm:text-xs font-bold text-white shadow-sm animate-bounce-subtle">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Cart notification */}
              {totalItems > 0 && (
                <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
                  <div className="flex items-center gap-2 px-2 sm:px-3 py-0.5 sm:py-1 shadow-lg animate-pulse rounded-full bg-gradient-to-r from-store-pink to-store-purple">
                    <span className="text-xs sm:text-sm font-medium text-white">Finalizar</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                </Link>
              )}
            </div>
            
            {/* Mobile menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-store-pink hover:bg-gray-100 btn-pop p-1.5">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="glass-morphism border-l border-gray-100">
                  <nav className="flex flex-col gap-4 pt-10">
                    <Link to="/" className="text-lg font-medium text-gradient hover-scale btn-pop">
                      Início
                    </Link>
                    <Link to="/cart" className="text-lg font-medium text-gradient hover-scale btn-pop">
                      Carrinho
                    </Link>
                    <Link to="/admin" className="flex items-center gap-2 text-lg font-medium text-gray-500 hover:text-store-pink hover-scale btn-pop">
                      <Lock className="h-4 w-4" />
                      Admin
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Welcome message */}
      {settings.welcomeMessage && (
        <div className="bg-gradient-to-r from-store-pink/10 to-store-purple/10 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-800 animate-fade-in shadow-sm">
          {settings.welcomeMessage}
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";
export default Header;
