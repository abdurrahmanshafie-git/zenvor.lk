export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  fabric?: string;
  fit?: string;
  gsm?: number;
  stock?: number;
  active?: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  sizes: string[];
  colors: string[];
  series?: string;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedSize: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
}
