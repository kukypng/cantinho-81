
import React, { createContext, useContext, useState, useEffect } from "react";
import { Coupon } from "@/types";
import configCoupons from "@/config/coupons.json";

interface CouponContextType {
  coupons: Coupon[];
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

  // Load coupons from localStorage on mount, falling back to config file
  useEffect(() => {
    try {
      const savedCoupons = localStorage.getItem("coupons");
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        // Use coupons from config file if none found in localStorage
        setCoupons(configCoupons as Coupon[]);
        localStorage.setItem("coupons", JSON.stringify(configCoupons));
      }
      
      // Load applied coupon from localStorage if exists
      const savedAppliedCoupon = localStorage.getItem("appliedCoupon");
      if (savedAppliedCoupon) {
        setAppliedCoupon(JSON.parse(savedAppliedCoupon));
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load coupons:", error);
      setCoupons(configCoupons as Coupon[]);
      setIsLoaded(true);
    }
  }, []);

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
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) return 0;
    
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
