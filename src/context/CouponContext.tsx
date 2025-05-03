
import React, { createContext, useContext, useState, useEffect } from "react";
import { Coupon } from "@/types";
import defaultCoupons from "@/data/defaultCoupons.json";

interface CouponContextType {
  coupons: Coupon[];
  activeCouponCode: string;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  updateCoupon: (coupon: Coupon) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  calculateDiscount: (subtotal: number, deliveryFee: number) => number;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeCouponCode, setActiveCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load coupons from localStorage on mount
  useEffect(() => {
    try {
      const savedCoupons = localStorage.getItem("coupons");
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        // If no coupons in localStorage, use default ones
        setCoupons(defaultCoupons as Coupon[]);
      }
    } catch (error) {
      console.error("Failed to load coupons:", error);
      setCoupons(defaultCoupons as Coupon[]);
    }
  }, []);

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("coupons", JSON.stringify(coupons));
    } catch (error) {
      console.error("Failed to save coupons:", error);
    }
  }, [coupons]);

  // Apply coupon
  const applyCoupon = (code: string) => {
    const upperCode = code.toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === upperCode);

    if (!coupon) {
      return { success: false, message: "Cupom não encontrado" };
    }

    if (!coupon.active) {
      return { success: false, message: "Este cupom não está mais ativo" };
    }

    // Check expiry date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, message: "Este cupom expirou" };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, message: "Este cupom atingiu o limite de uso" };
    }

    setActiveCouponCode(coupon.code);
    setAppliedCoupon(coupon);
    
    return { success: true, message: "Cupom aplicado com sucesso!" };
  };

  // Remove coupon
  const removeCoupon = () => {
    setActiveCouponCode("");
    setAppliedCoupon(null);
  };

  // Calculate discount
  const calculateDiscount = (subtotal: number, deliveryFee: number) => {
    if (!appliedCoupon) return 0;

    // Check minimum order value
    if (subtotal < appliedCoupon.minOrderValue) {
      return 0;
    }

    let discount = 0;
    
    if (appliedCoupon.discountType === "percentage") {
      discount = subtotal * (appliedCoupon.discountValue / 100);
    } else if (appliedCoupon.discountType === "fixed") {
      discount = appliedCoupon.discountValue;
    }

    // Don't allow discount to exceed the total
    const total = subtotal + deliveryFee;
    if (discount > total) {
      discount = total;
    }

    return discount;
  };

  // Update coupon
  const updateCoupon = (coupon: Coupon) => {
    setCoupons(prevCoupons => 
      prevCoupons.map(c => c.code === coupon.code ? coupon : c)
    );
    
    // If this is the currently applied coupon, update it
    if (appliedCoupon && appliedCoupon.code === coupon.code) {
      setAppliedCoupon(coupon);
    }
  };

  // Add new coupon
  const addCoupon = (coupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, coupon]);
  };

  // Delete coupon
  const deleteCoupon = (code: string) => {
    setCoupons(prevCoupons => prevCoupons.filter(c => c.code !== code));
    
    // If this was the currently applied coupon, remove it
    if (activeCouponCode === code) {
      removeCoupon();
    }
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        activeCouponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        updateCoupon,
        addCoupon,
        deleteCoupon
      }}
    >
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
