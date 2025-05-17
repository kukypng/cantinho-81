
import React, { createContext, useContext, useState, useEffect } from "react";
import { Coupon } from "@/types";
import defaultCoupons from "@/config/defaultCoupons.json";

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; message?: string; coupon?: Coupon };
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number, deliveryFee: number) => number;
  isLoaded: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load coupons from localStorage on mount
  useEffect(() => {
    try {
      const savedCoupons = localStorage.getItem("coupons");
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        // Use default coupons if none found
        // Cast defaultCoupons to Coupon[] to ensure type safety
        setCoupons(defaultCoupons as Coupon[]);
        localStorage.setItem("coupons", JSON.stringify(defaultCoupons));
      }
      
      // Load applied coupon from localStorage if exists
      const savedAppliedCoupon = localStorage.getItem("appliedCoupon");
      if (savedAppliedCoupon) {
        setAppliedCoupon(JSON.parse(savedAppliedCoupon));
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load coupons:", error);
      setCoupons(defaultCoupons as Coupon[]);
      setIsLoaded(true);
    }
  }, []);

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("coupons", JSON.stringify(coupons));
      } catch (error) {
        console.error("Failed to save coupons:", error);
      }
    }
  }, [coupons, isLoaded]);

  // Save applied coupon to localStorage whenever it changes
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

  const addCoupon = (coupon: Coupon) => {
    const normalizedCode = coupon.code.toUpperCase();
    const exists = coupons.some(c => c.code.toUpperCase() === normalizedCode);
    
    if (exists) {
      throw new Error(`Cupom com código ${coupon.code} já existe`);
    }

    setCoupons([...coupons, { ...coupon, code: normalizedCode }]);
  };

  const updateCoupon = (coupon: Coupon) => {
    const normalizedCode = coupon.code.toUpperCase();
    setCoupons(coupons.map(c => c.code.toUpperCase() === normalizedCode ? { ...coupon, code: normalizedCode } : c));
  };

  const deleteCoupon = (code: string) => {
    const normalizedCode = code.toUpperCase();
    setCoupons(coupons.filter(c => c.code.toUpperCase() !== normalizedCode));
    
    // If the deleted coupon was applied, remove it
    if (appliedCoupon && appliedCoupon.code.toUpperCase() === normalizedCode) {
      setAppliedCoupon(null);
    }
  };

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

  const applyCoupon = (code: string) => {
    // If a coupon is already applied, remove it first
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
    
    // We don't check minOrderValue here because it's checked during checkout
    
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return { success: false, message: "Este cupom está expirado" };
    }
    
    if (coupon.usageLimit && coupon.usageCount && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, message: "Este cupom atingiu o limite de uso" };
    }
    
    // Apply the coupon
    setAppliedCoupon(coupon);
    
    // If this coupon has usage tracking
    if (coupon.usageLimit) {
      const updatedCoupon = {
        ...coupon,
        usageCount: (coupon.usageCount || 0) + 1
      };
      updateCoupon(updatedCoupon);
    }
    
    return { 
      success: true, 
      message: `Cupom "${coupon.code}" aplicado com sucesso: ${coupon.description}` 
    };
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  
  const calculateDiscount = (subtotal: number, deliveryFee: number) => {
    if (!appliedCoupon) return 0;
    
    // Check if the minimum order value is met
    if (subtotal < appliedCoupon.minOrderValue) return 0;
    
    let discountAmount = 0;
    
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discountValue / 100);
    } else if (appliedCoupon.discountType === "fixed") {
      // Fixed amount discount
      discountAmount = appliedCoupon.discountValue;
      
      // For shipping discounts (like "FRETEGRATIS"), apply to delivery fee
      if (appliedCoupon.discountValue === deliveryFee) {
        discountAmount = deliveryFee;
      }
    }
    
    // Don't allow discount to exceed total
    const total = subtotal + deliveryFee;
    return Math.min(discountAmount, total);
  };

  return (
    <CouponContext.Provider value={{ 
      coupons, 
      addCoupon, 
      updateCoupon, 
      deleteCoupon, 
      validateCoupon,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      calculateDiscount,
      isLoaded 
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
