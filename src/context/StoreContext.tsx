
import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreSettings } from "@/types";
import defaultSettingsData from "@/config/defaultSettings.json";
import configStore from "@/config/store.json";

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  isLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Combine default settings with config settings, prioritizing localStorage
  const initialSettings = { ...defaultSettingsData, ...configStore };
  
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
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
