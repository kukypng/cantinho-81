
import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Info, Phone } from "lucide-react";

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
  },
  {
    name: "Sobre",
    href: "/",
    icon: Info
  },
  {
    name: "Contato",
    href: "/",
    icon: Phone
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
              isActive 
                ? 'text-store-pink bg-store-pink/10 font-semibold' 
                : 'text-gray-600 hover:text-store-pink'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
});

NavigationLinks.displayName = "NavigationLinks";

export default NavigationLinks;
