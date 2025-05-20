
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingCart, User, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";

// Using memo to prevent unnecessary re-renders
const MobileMenu = memo(() => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { settings } = useStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <User className="h-5 w-5 text-store-pink" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="glass-morphism w-[250px] pt-10"
      >
        <nav className="flex flex-col gap-4">
          <SheetClose asChild>
            <Link to="/" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
              <Home className="w-5 h-5 text-store-pink" />
              <span className="text-gray-800">Início</span>
            </Link>
          </SheetClose>
          
          <SheetClose asChild>
            <Link to="/cart" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-store-pink" />
              <span className="text-gray-800">Carrinho</span>
            </Link>
          </SheetClose>
          
          {isAuthenticated && isAdmin && (
            <SheetClose asChild>
              <Link 
                to="/admin" 
                className="flex items-center gap-2 py-2 px-3 rounded-md text-store-pink hover:bg-gray-100 transition-colors"
              >
                <Lock className="w-5 h-5" />
                <span>Área Administrativa</span>
              </Link>
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
