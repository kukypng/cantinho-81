import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Search, Lock, User, Heart, Settings } from "lucide-react";
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
  const {
    totalItems
  } = useCart();
  const {
    settings
  } = useStore();
  const {
    isAdmin
  } = useAuth();
  const isMobile = useIsMobile();
  return <header className="sticky top-0 z-10 animate-fade-in shadow-lg bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo and store name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF1B8D] to-[#9747FF] bg-clip-text text-transparent drop-shadow-sm shine-effect">
              {settings.storeName}
            </span>
          </Link>
        </div>
        
        {/* Navigation links - desktop only */}
        <NavigationLinks isMobile={isMobile} />

        {/* Search bar - desktop only */}
        {!isMobile}

        {/* Desktop actions */}
        {!isMobile && <div className="hidden md:flex items-center gap-3">
            {/* Favorites button */}
            
            
            {/* User account */}
            
            
            {/* Admin access */}
            <Link to="/admin">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-store-pink hover:border-store-pink btn-pop">
                <Lock className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>}

        {/* Cart and mobile menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile search */}
          {isMobile && <MobileSearch />}

          {/* Cart icon with counter */}
          <div className="relative">
            <Link to="/cart" className="relative btn-pop group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 border border-gray-200">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-store-pink" />
              </div>
              {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-store-pink to-store-purple text-xs font-bold text-white shadow-lg animate-pulse border-2 border-white">
                  {totalItems}
                </span>}
            </Link>
            
            {/* Cart notification - desktop only */}
            {totalItems > 0 && !isMobile && <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap">
                <div className="flex items-center gap-2 px-4 py-2 shadow-xl rounded-full bg-gradient-to-r from-store-pink to-store-purple hover:from-store-pink/90 hover:to-store-purple/90 transition-all duration-200 hover:scale-105">
                  <span className="text-sm font-semibold text-white">Finalizar Compra</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </Link>}
          </div>
          
          {/* Mobile menu */}
          {isMobile && <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-store-pink hover:bg-store-pink/10 btn-pop p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-morphism border-l border-gray-100 w-80">
                <nav className="flex flex-col gap-6 pt-12">
                  <Link to="/" className="flex items-center gap-3 text-lg font-medium text-gradient hover-scale btn-pop p-3 rounded-lg hover:bg-gray-50">
                    <User className="h-5 w-5" />
                    Minha Conta
                  </Link>
                  <Link to="/" className="flex items-center gap-3 text-lg font-medium text-gradient hover-scale btn-pop p-3 rounded-lg hover:bg-gray-50">
                    <Heart className="h-5 w-5" />
                    Favoritos
                  </Link>
                  <Link to="/cart" className="flex items-center gap-3 text-lg font-medium text-gradient hover-scale btn-pop p-3 rounded-lg hover:bg-gray-50">
                    <ShoppingCart className="h-5 w-5" />
                    Carrinho
                  </Link>
                  <Link to="/admin" className="flex items-center gap-3 text-lg font-medium text-gray-500 hover:text-store-pink hover-scale btn-pop p-3 rounded-lg hover:bg-gray-50">
                    <Lock className="h-5 w-5" />
                    Administração
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>}
        </div>
      </div>

      {/* Welcome message with enhanced design */}
      {settings.welcomeMessage && <div className="bg-gradient-to-r from-store-pink/5 via-store-purple/5 to-store-pink/5 border-t border-store-pink/10 p-3 text-center text-sm font-medium text-gray-800 animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-store-pink rounded-full animate-pulse"></div>
            {settings.welcomeMessage}
            <div className="w-2 h-2 bg-store-purple rounded-full animate-pulse"></div>
          </div>
        </div>}
    </header>;
});
Header.displayName = "Header";
export default Header;