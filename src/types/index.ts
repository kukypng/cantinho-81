
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
 *   category: "Bolos no pote",
 *   stock: 100,
 *   maxPurchaseQuantity: 5
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
  stock?: number;
  maxPurchaseQuantity?: number;
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
 * Representa um cupom de desconto
 * @example
 * {
 *   code: "BEMVINDO10",
 *   discountType: "percentage",
 *   discountValue: 10,
 *   minOrderValue: 0,
 *   active: true,
 *   description: "10% de desconto na primeira compra"
 * }
 */
export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  active: boolean;
  description: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
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
 *   announcements: ["Feriado: 30% OFF", "Entrega grátis acima de R$50"],
 *   freeDeliveryMessage: "Entrega Grátis acima de R$ 50",
 *   showFreeDeliveryBanner: true,
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
  announcements?: string[];
  freeDeliveryMessage?: string;
  showFreeDeliveryBanner?: boolean;
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
