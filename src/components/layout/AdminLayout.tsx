
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/context/StoreContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { logout } = useAuth();
  const { settings } = useStore();
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produtos", href: "/admin/products", icon: Package2 },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden w-64 flex-shrink-0 border-r bg-white md:block">
          <div className="flex h-16 items-center justify-center border-b">
            <h2 className="text-lg font-bold text-gray-900">{settings.storeName}</h2>
          </div>
          <nav className="flex flex-col p-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`mb-1 flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            <Link to="/" className="mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Loja
            </Link>
            
            <button
              onClick={() => logout()}
              className="mt-4 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4">
          <div className="flex items-center">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col py-6">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">{settings.storeName}</h2>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`mb-1 flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          isActive(item.href)
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                    
                    <Link to="/" className="mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Voltar para Loja
                    </Link>
                    
                    <button
                      onClick={() => logout()}
                      className="mt-4 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <h1 className="ml-2 text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
