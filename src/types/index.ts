
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  featured?: boolean;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  address?: string;
  welcomeMessage?: string;
  footerMessage?: string;
  customCakeMessage?: string;
  socialMedia?: {
    instagram?: string;
    whatsapp?: string;
  };
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}
