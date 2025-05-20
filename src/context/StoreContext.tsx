
import React, { createContext, useContext, useState } from "react";
import { StoreSettings } from "@/types";
import defaultSettingsData from "@/config/defaultSettings.json";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => Promise<void>;
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const fetchStoreSettings = async (): Promise<StoreSettings> => {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .single();
  
  if (error) {
    // Se não encontrou configurações, retorna as configurações padrão
    if (error.code === 'PGRST116') {
      return defaultSettingsData as StoreSettings;
    }
    throw new Error(error.message);
  }
  
  // Formata os dados para o formato esperado pelo app
  return {
    storeName: data.store_name,
    whatsappNumber: data.whatsapp_number || '',
    deliveryFee: data.delivery_fee || 0,
    freeDeliveryThreshold: data.free_delivery_threshold,
    address: data.address,
    welcomeMessage: data.welcome_message,
    footerMessage: data.footer_message,
    customCakeMessage: data.custom_cake_message,
    logoUrl: data.logo_url,
    freeDeliveryMessage: data.free_delivery_message,
    showFreeDeliveryBanner: data.show_free_delivery_banner,
    socialMedia: data.social_media || {}
  } as StoreSettings;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Usar React Query para buscar as configurações - fix onSettled issue
  const { 
    data: settings = defaultSettingsData as StoreSettings, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: fetchStoreSettings,
    // Remove onSettled and handle state change differently
  });

  // Update isLoaded state when query completes
  React.useEffect(() => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  // Mutação para atualizar as configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: StoreSettings) => {
      // Converte para o formato esperado pelo banco de dados
      const dbSettings = {
        store_name: newSettings.storeName,
        whatsapp_number: newSettings.whatsappNumber,
        delivery_fee: newSettings.deliveryFee,
        free_delivery_threshold: newSettings.freeDeliveryThreshold,
        address: newSettings.address,
        welcome_message: newSettings.welcomeMessage,
        footer_message: newSettings.footerMessage,
        custom_cake_message: newSettings.customCakeMessage,
        logo_url: newSettings.logoUrl,
        free_delivery_message: newSettings.freeDeliveryMessage,
        show_free_delivery_banner: newSettings.showFreeDeliveryBanner,
        social_media: newSettings.socialMedia || {}
      };

      // Verificar se já existem configurações
      const { data: existingSettings } = await supabase
        .from('store_settings')
        .select('id')
        .single();
        
      if (existingSettings) {
        // Atualizar configurações existentes
        const { data, error } = await supabase
          .from('store_settings')
          .update(dbSettings)
          .eq('id', existingSettings.id)
          .select();
          
        if (error) throw new Error(error.message);
        return data;
      } else {
        // Inserir novas configurações
        const { data, error } = await supabase
          .from('store_settings')
          .insert(dbSettings)
          .select();
          
        if (error) throw new Error(error.message);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar configurações: ${error.message}`);
    }
  });

  const updateSettings = async (newSettings: StoreSettings) => {
    await updateSettingsMutation.mutateAsync(newSettings);
  };

  return (
    <StoreContext.Provider value={{ 
      settings, 
      updateSettings, 
      isLoaded,
      isLoading,
      error: error as Error | null
    }}>
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
