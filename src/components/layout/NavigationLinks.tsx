import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Info, Phone } from "lucide-react";
interface NavigationLinksProps {
  isMobile: boolean;
}
const navigationItems = [{
  name: "Início",
  href: "/",
  icon: Home
}, {
  name: "Produtos",
  href: "/",
  icon: ShoppingCart
}, {
  name: "Sobre",
  href: "/",
  icon: Info
}, {
  name: "Contato",
  href: "/",
  icon: Phone
}];
const NavigationLinks = memo(({
  isMobile
}: NavigationLinksProps) => {
  const location = useLocation();
  if (isMobile) return null;
  return <nav className="hidden lg:flex items-center space-x-8">
      {navigationItems.map(item => {
      const isActive = location.pathname === item.href;
      const Icon = item.icon;
      return;
    })}
    </nav>;
});
NavigationLinks.displayName = "NavigationLinks";
export default NavigationLinks;