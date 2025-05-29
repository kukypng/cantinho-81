
import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart } from "lucide-react";

interface NavigationLinksProps {
  isMobile: boolean;
}

const navigationItems = [
  {
    name: "Início",
    href: "/",
    icon: Home
  },
  {
    name: "Produtos",
    href: "/",
    icon: ShoppingCart
  }
];

const NavigationLinks = memo(({ isMobile }: NavigationLinksProps) => {
  const location = useLocation();
  
  if (isMobile) return null;
  
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-store-pink/10 hover:to-store-purple/10 hover:shadow-md ${
              isActive 
                ? 'text-store-pink bg-gradient-to-r from-store-pink/10 to-store-purple/10 font-semibold shadow-md border border-store-pink/20' 
                : 'text-gray-600 hover:text-store-pink'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
});

NavigationLinks.displayName = "NavigationLinks";

export default NavigationLinks;
