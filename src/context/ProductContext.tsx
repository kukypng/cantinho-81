
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import configProducts from "@/config/products.json";

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
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

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  // Add a new product
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(), // Simple ID generation
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast.success("Produto adicionado com sucesso!");
  };

  // Update an existing product
  const updateProduct = (product: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === product.id ? product : p)
    );
    toast.success("Produto atualizado com sucesso!");
  };

  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Produto removido com sucesso!");
  };

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
        addProduct,
        updateProduct,
        deleteProduct
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
