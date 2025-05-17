
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import initialProductsData from "@/config/initialProducts.json";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (id: string) => Product | undefined;
  featuredProducts: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Use sample products if none found
        setProducts(initialProductsData);
        localStorage.setItem("products", JSON.stringify(initialProductsData));
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      // Fall back to initial products
      setProducts(initialProductsData);
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products:", error);
    }
  }, [products]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
    toast.success(`Produto ${product.name} adicionado com sucesso!`);
  };

  const updateProduct = (product: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === product.id ? product : p))
    );
    toast.success(`Produto ${product.name} atualizado com sucesso!`);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
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
        addProduct,
        updateProduct,
        deleteProduct,
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
