
import { useState, useEffect } from 'react';
import storeConfig from '@/config/store.json';
import appearanceConfig from '@/config/appearance.json';
import defaultCoupons from '@/config/defaultCoupons.json';

/**
 * Hook para acessar e gerenciar as configurações do site
 * Simplifica o acesso às configurações para uso em componentes
 */
export function useConfig() {
  const [store, setStore] = useState(storeConfig);
  const [appearance, setAppearance] = useState(appearanceConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega configurações ao inicializar
  useEffect(() => {
    try {
      // Primeiro carrega das configurações padrão
      const configStore = storeConfig;
      const configAppearance = appearanceConfig;
      
      // Depois verifica se há configurações salvas no localStorage
      const savedStoreConfig = localStorage.getItem('storeConfig');
      const savedAppearanceConfig = localStorage.getItem('appearanceConfig');
      
      if (savedStoreConfig) {
        setStore(JSON.parse(savedStoreConfig));
      }
      
      if (savedAppearanceConfig) {
        setAppearance(JSON.parse(savedAppearanceConfig));
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      setIsLoaded(true);
    }
  }, []);

  /**
   * Atualiza as configurações da loja
   * @param newConfig Novas configurações
   */
  const updateStoreConfig = (newConfig: any) => {
    setStore(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      localStorage.setItem('storeConfig', JSON.stringify(updatedConfig));
      return updatedConfig;
    });
  };

  /**
   * Atualiza as configurações de aparência
   * @param newConfig Novas configurações
   */
  const updateAppearanceConfig = (newConfig: any) => {
    setAppearance(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      localStorage.setItem('appearanceConfig', JSON.stringify(updatedConfig));
      return updatedConfig;
    });
  };

  /**
   * Restaura configurações para os valores padrão
   * @param configType Tipo de configuração ('store' ou 'appearance')
   */
  const resetToDefault = (configType: 'store' | 'appearance' | 'all') => {
    if (configType === 'store' || configType === 'all') {
      setStore(storeConfig);
      localStorage.setItem('storeConfig', JSON.stringify(storeConfig));
    }
    
    if (configType === 'appearance' || configType === 'all') {
      setAppearance(appearanceConfig);
      localStorage.setItem('appearanceConfig', JSON.stringify(appearanceConfig));
    }
  };

  return {
    store,
    appearance,
    updateStoreConfig,
    updateAppearanceConfig,
    resetToDefault,
    isLoaded
  };
}
