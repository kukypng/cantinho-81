
import React, { memo } from "react";
import { cn } from "@/lib/utils";
import Header from "./Header";
import Footer from "./Footer";
import LegalNotices from "@/components/legal/LegalNotices";

interface StoreLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const StoreLayout: React.FC<StoreLayoutProps> = memo(({
  children,
  showHeader = true,
  showFooter = true
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-gray-50">
      {showHeader && <Header />}
      
      <main className={cn("flex-1", !showHeader && "pt-0")}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {showFooter && <Footer />}
      <LegalNotices />
    </div>
  );
});

StoreLayout.displayName = "StoreLayout";
export default StoreLayout;
