
import React, { memo } from "react";
import { Link } from "react-router-dom";

interface NavigationLinksProps {
  isMobile: boolean;
}

const navigationItems = [
  { name: "Início", href: "/" },
  { name: "Carrinho", href: "/cart" }
];

const NavigationLinks = memo(({ isMobile }: NavigationLinksProps) => {
  if (isMobile) return null;

  return (
    <nav className="hidden space-x-6 md:flex">
      {navigationItems.map(item => (
        <Link 
          key={item.name} 
          to={item.href} 
          className="text-sm font-medium text-gray-700 transition-colors hover:text-store-pink hover:underline py-1 btn-pop"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
});

NavigationLinks.displayName = "NavigationLinks";
export default NavigationLinks;
