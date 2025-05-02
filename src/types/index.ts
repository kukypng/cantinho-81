
/**
 * Representa um produto na loja
 * @example
 * {
 *   id: "1",
 *   name: "Bolo de Chocolate",
 *   description: "Delicioso bolo caseiro",
 *   price: 25.90,
 *   imageUrl: "https://...",
 *   featured: true,
 *   category: "Bolos no pote"
 * }
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  featured?: boolean;
  category?: string;
}

/**
 * Representa um item no carrinho de compras
 * @example
 * {
 *   product: { id: "1", name: "Bolo", price: 25.90, ... },
 *   quantity: 2
 * }
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Configurações da loja que podem ser editadas pelo administrador
 * @example
 * {
 *   storeName: "Minha Loja",
 *   whatsappNumber: "5511999999999",
 *   deliveryFee: 10,
 *   freeDeliveryThreshold: 50,
 *   welcomeMessage: "Bem-vindo!",
 *   footerMessage: "Feito com amor",
 *   customCakeMessage: "Descreva seu bolo personalizado:",
 *   socialMedia: { 
 *     instagram: "https://instagram.com/minhaloja",
 *     whatsapp: "https://wa.me/5511999999999"
 *   }
 * }
 */
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

/**
 * Representa um usuário do sistema
 * @example
 * {
 *   id: "1",
 *   email: "admin@exemplo.com",
 *   isAdmin: true
 * }
 */
export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}
