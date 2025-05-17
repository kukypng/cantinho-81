
import React, { createContext, useContext, useState, useEffect } from "react";
import { Coupon } from "@/types";
import defaultCoupons from "@/config/defaultCoupons.json";

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; message?: string; coupon?: Coupon };
  isLoaded: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load coupons from localStorage on mount
  useEffect(() => {
    try {
      const savedCoupons = localStorage.getItem("coupons");
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        // Use default coupons if none found
        setCoupons(defaultCoupons);
        localStorage.setItem("coupons", JSON.stringify(defaultCoupons));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load coupons:", error);
      setCoupons(defaultCoupons);
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

  return (
    <CouponContext.Provider value={{ 
      coupons, 
      addCoupon, 
      updateCoupon, 
      deleteCoupon, 
      validateCoupon,
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
