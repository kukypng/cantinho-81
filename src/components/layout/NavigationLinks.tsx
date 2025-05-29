
import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Info, Phone } from "lucide-react";

interface NavigationLinksProps {
  isMobile: boolean;
}

const navigationItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "Produtos", href: "/", icon: ShoppingCart },
  { name: "Sobre", href: "/", icon: Info },
  { name: "Contato", href: "/", icon: Phone }
];

const NavigationLinks = memo(({ isMobile }: NavigationLinksProps) => {
  const location = useLocation();
  
  if (isMobile) return null;

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navigationItems.map(item => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            to={item.href} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 btn-pop ${
              isActive 
                ? 'bg-gradient-to-r from-store-pink/10 to-store-purple/10 text-store-pink border border-store-pink/20' 
                : 'text-gray-700 hover:text-store-pink hover:bg-store-pink/5'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
});

NavigationLinks.displayName = "NavigationLinks";
export default NavigationLinks;
