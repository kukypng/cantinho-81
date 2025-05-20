
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Product[];
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use React Query para gerenciar dados
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Mutação para adicionar produto
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Produto adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    }
  });

  // Mutação para atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { id, ...rest } = product;
      const { data, error } = await supabase
        .from('products')
        .update({ ...rest, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
    }
  });

  // Mutação para deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Produto removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover produto: ${error.message}`);
    }
  });

  // Adicionar um novo produto
  const addProduct = async (product: Omit<Product, "id">) => {
    await addProductMutation.mutateAsync(product);
  };

  // Atualizar um produto existente
  const updateProduct = async (product: Product) => {
    await updateProductMutation.mutateAsync(product);
  };

  // Deletar um produto
  const deleteProduct = async (id: string) => {
    await deleteProductMutation.mutateAsync(id);
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
        deleteProduct,
        isLoading,
        error: error as Error | null
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
