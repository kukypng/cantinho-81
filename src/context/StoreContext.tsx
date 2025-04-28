
import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreSettings } from "@/types";

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  isLoaded: boolean;
}

const defaultSettings: StoreSettings = {
  storeName: "Parceiro 1 Store",
  whatsappNumber: "5511999999999",
  deliveryFee: 0,
  freeDeliveryThreshold: 0,
  welcomeMessage: "Feito com muito amor ❤️",
  footerMessage: "Produtos feitos com ❤️",
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("storeSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load settings:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("storeSettings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <StoreContext.Provider value={{ settings, updateSettings, isLoaded }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
