
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import configProducts from "@/config/products.json";

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount, falling back to config file
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Use products from config file if none found in localStorage
        setProducts(configProducts as Product[]);
        localStorage.setItem("products", JSON.stringify(configProducts));
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      // Fall back to config products
      setProducts(configProducts as Product[]);
    }
  }, []);

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const featuredProducts = products.filter(p => p.featured);

  return (
    <ProductContext.Provider
      value={{
        products,
        getProductById,
        featuredProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
