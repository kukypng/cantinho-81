import React, { createContext, useContext, useState, useEffect } from "react";
import { Coupon } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CouponContextType {
  coupons: Coupon[];
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; message?: string; coupon?: Coupon };
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number, deliveryFee: number) => number;
  isLoaded: boolean;
  isLoading: boolean;
  updateCoupon: (coupon: Coupon) => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, "active" | "usageCount">) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  error: Error | null;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

// Função para buscar cupons do Supabase
const fetchCoupons = async (): Promise<Coupon[]> => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('code');
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Converter do formato do banco para o formato da aplicação
  return data.map((item: any) => ({
    code: item.code,
    discountType: item.discount_type as "percentage" | "fixed",
    discountValue: item.discount_value,
    minOrderValue: item.min_order_value || 0,
    active: item.active,
    description: item.description || '',
    expiryDate: item.expiry_date,
    usageLimit: item.usage_limit,
    usageCount: item.usage_count || 0
  }));
};

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Usar React Query para buscar os cupons - fix onSettled issue
  const { 
    data: coupons = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons
  });
  
  // Update isLoaded state when query completes
  React.useEffect(() => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  // Carregar o cupom aplicado do localStorage
  useEffect(() => {
    try {
      const savedAppliedCoupon = localStorage.getItem("appliedCoupon");
      if (savedAppliedCoupon) {
        setAppliedCoupon(JSON.parse(savedAppliedCoupon));
      }
    } catch (error) {
      console.error("Failed to load applied coupon:", error);
    }
  }, []);

  // Salvar o cupom aplicado no localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        if (appliedCoupon) {
          localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
        } else {
          localStorage.removeItem("appliedCoupon");
        }
      } catch (error) {
        console.error("Failed to save applied coupon:", error);
      }
    }
  }, [appliedCoupon, isLoaded]);

  // Mutação para adicionar cupom
  const addCouponMutation = useMutation({
    mutationFn: async (coupon: Omit<Coupon, "active" | "usageCount">) => {
      // Converter para o formato do banco
      const dbCoupon = {
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        min_order_value: coupon.minOrderValue,
        active: true,
        description: coupon.description,
        expiry_date: coupon.expiryDate,
        usage_limit: coupon.usageLimit,
        usage_count: 0
      };

      const { data, error } = await supabase
        .from('coupons')
        .insert(dbCoupon)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Cupom adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar cupom: ${error.message}`);
    }
  });

  // Mutação para atualizar cupom
  const updateCouponMutation = useMutation({
    mutationFn: async (coupon: Coupon) => {
      // Converter para o formato do banco
      const dbCoupon = {
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        min_order_value: coupon.minOrderValue,
        active: coupon.active,
        description: coupon.description,
        expiry_date: coupon.expiryDate,
        usage_limit: coupon.usageLimit,
        usage_count: coupon.usageCount || 0
      };

      const { data, error } = await supabase
        .from('coupons')
        .update(dbCoupon)
        .eq('code', coupon.code)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Cupom atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar cupom: ${error.message}`);
    }
  });

  // Mutação para deletar cupom
  const deleteCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('code', code);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Cupom removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover cupom: ${error.message}`);
    }
  });

  // Adicionar um novo cupom
  const addCoupon = async (coupon: Omit<Coupon, "active" | "usageCount">) => {
    await addCouponMutation.mutateAsync(coupon);
  };

  // Atualizar um cupom existente
  const updateCoupon = async (coupon: Coupon) => {
    await updateCouponMutation.mutateAsync(coupon);
  };

  // Deletar um cupom
  const deleteCoupon = async (code: string) => {
    // Se este é o cupom aplicado, removê-lo
    if (appliedCoupon && appliedCoupon.code === code) {
      setAppliedCoupon(null);
    }
    
    await deleteCouponMutation.mutateAsync(code);
  };

  // Validar cupom (verifica se é válido para a compra)
  const validateCoupon = (code: string, orderTotal: number) => {
    const normalizedCode = code.toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === normalizedCode);
    
    if (!coupon) {
      return { valid: false, message: "Cupom inválido" };
    }
    
    if (!coupon.active) {
      return { valid: false, message: "Este cupom não está mais ativo" };
    }
    
    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
      return { 
        valid: false, 
        message: `Este cupom é válido apenas para compras acima de R$${coupon.minOrderValue.toFixed(2)}` 
      };
    }
    
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return { valid: false, message: "Este cupom está expirado" };
    }
    
    if (coupon.usageLimit && coupon.usageCount && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: "Este cupom atingiu o limite de uso" };
    }
    
    return { valid: true, coupon };
  };

  // Aplicar cupom
  const applyCoupon = (code: string) => {
    // Remover cupom existente
    if (appliedCoupon) {
      setAppliedCoupon(null);
    }
    
    const normalizedCode = code.toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === normalizedCode);
    
    if (!coupon) {
      return { success: false, message: "Cupom inválido" };
    }
    
    if (!coupon.active) {
      return { success: false, message: "Este cupom não está mais ativo" };
    }
    
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return { success: false, message: "Este cupom está expirado" };
    }
    
    if (coupon.usageLimit && coupon.usageCount && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, message: "Este cupom atingiu o limite de uso" };
    }
    
    // Aplicar o cupom
    setAppliedCoupon(coupon);
    
    return { 
      success: true, 
      message: `Cupom "${coupon.code}" aplicado com sucesso: ${coupon.description}` 
    };
  };
  
  // Remover cupom aplicado
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  
  // Calcular o desconto baseado no cupom aplicado
  const calculateDiscount = (subtotal: number, deliveryFee: number) => {
    if (!appliedCoupon) return 0;
    
    // Verificar se atinge o valor mínimo
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) return 0;
    
    let discountAmount = 0;
    
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discountValue / 100);
    } else if (appliedCoupon.discountType === "fixed") {
      // Desconto de valor fixo
      discountAmount = appliedCoupon.discountValue;
      
      // Para descontos de frete (como "FRETEGRATIS")
      if (appliedCoupon.discountValue === deliveryFee) {
        discountAmount = deliveryFee;
      }
    }
    
    // Não permitir que o desconto exceda o total
    const total = subtotal + deliveryFee;
    return Math.min(discountAmount, total);
  };

  return (
    <CouponContext.Provider value={{ 
      coupons, 
      validateCoupon,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      calculateDiscount,
      isLoaded,
      isLoading,
      updateCoupon,
      addCoupon,
      deleteCoupon,
      error: error as Error | null
    }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
};
