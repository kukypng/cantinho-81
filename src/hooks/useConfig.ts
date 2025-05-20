
import { useState, useEffect } from 'react';
import storeConfig from '@/config/store.json';
import appearanceConfig from '@/config/appearance.json';
import productsConfig from '@/config/products.json';
import couponsConfig from '@/config/coupons.json';

/**
 * Hook para acessar as configurações do site de forma centralizada
 */
export function useConfig() {
  const [store, setStore] = useState(storeConfig);
  const [appearance, setAppearance] = useState(appearanceConfig);
  const [products, setProducts] = useState(productsConfig);
  const [coupons, setCoupons] = useState(couponsConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega configurações ao inicializar
  useEffect(() => {
    try {
      // Primeiro carrega das configurações padrão
      const configStore = storeConfig;
      const configAppearance = appearanceConfig;
      const configProducts = productsConfig;
      const configCoupons = couponsConfig;
      
      // Depois verifica se há configurações salvas no localStorage
      const savedStoreConfig = localStorage.getItem('storeConfig');
      const savedAppearanceConfig = localStorage.getItem('appearanceConfig');
      const savedProductsConfig = localStorage.getItem('products');
      const savedCouponsConfig = localStorage.getItem('coupons');
      
      if (savedStoreConfig) {
        setStore(JSON.parse(savedStoreConfig));
      }
      
      if (savedAppearanceConfig) {
        setAppearance(JSON.parse(savedAppearanceConfig));
      }
      
      if (savedProductsConfig) {
        setProducts(JSON.parse(savedProductsConfig));
      }
      
      if (savedCouponsConfig) {
        setCoupons(JSON.parse(savedCouponsConfig));
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      setIsLoaded(true);
    }
  }, []);

  return {
    store,
    appearance,
    products,
    coupons,
    isLoaded
  };
}
