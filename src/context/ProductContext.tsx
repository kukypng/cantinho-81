
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";

// Sample product data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Tênis Esportivo Premium",
    description: "Tênis esportivo de alta performance",
    price: 299.00,
    imageUrl: "/lovable-uploads/c565362a-b192-4b93-a158-887bb045b216.png",
    featured: true,
    category: "Calçados"
  },
  {
    id: "2",
    name: "Mochila Executiva",
    description: "Mochila executiva com compartimento para laptop",
    price: 189.00,
    imageUrl: "https://placehold.co/400x300/eee/ccc",
    category: "Acessórios"
  },
  {
    id: "3",
    name: "Relógio Smart",
    description: "Smartwatch com monitor cardíaco",
    price: 399.00,
    imageUrl: "https://placehold.co/400x300/333/666",
    category: "Eletrônicos"
  },
  {
    id: "4",
    name: "Fone Bluetooth",
    description: "Fone de ouvido sem fio com cancelamento de ruído",
    price: 129.00,
    imageUrl: "https://placehold.co/400x300/ffff00/000000",
    featured: true,
    category: "Eletrônicos"
  }
];

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
        setProducts(initialProducts);
        localStorage.setItem("products", JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      // Fall back to initial products
      setProducts(initialProducts);
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
