export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

type Timestamped = {
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Timestamped & {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      categories: {
        Row: Timestamped & {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          active: boolean;
          sort_order: number;
        };
        Insert: Partial<Timestamped> & {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          active?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: Timestamped & {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          price: number;
          category: string;
          description: string;
          fabric: string | null;
          fit: string | null;
          gsm: number | null;
          sizes: string[];
          colors: string[];
          stock: number;
          low_stock_threshold: number;
          image_url: string;
          gallery_images: string[];
          series: string | null;
          active: boolean;
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
        };
        Insert: Partial<Timestamped> & {
          id: string;
          category_id?: string | null;
          name: string;
          slug: string;
          price: number;
          category: string;
          description?: string;
          fabric?: string | null;
          fit?: string | null;
          gsm?: number | null;
          sizes?: string[];
          colors?: string[];
          stock?: number;
          low_stock_threshold?: number;
          image_url: string;
          gallery_images?: string[];
          series?: string | null;
          active?: boolean;
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>;
      };
      carts: {
        Row: Timestamped & { id: string; user_id: string; status: 'active' | 'ordered' | 'abandoned' };
        Insert: Partial<Timestamped> & { id?: string; user_id: string; status?: 'active' | 'ordered' | 'abandoned' };
        Update: Partial<Database['public']['Tables']['carts']['Insert']>;
      };
      cart_items: {
        Row: Timestamped & { id: string; cart_id: string; product_id: string; selected_size: string; quantity: number };
        Insert: Partial<Timestamped> & { id?: string; cart_id: string; product_id: string; selected_size: string; quantity: number };
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>;
      };
      orders: {
        Row: Timestamped & {
          id: string;
          order_number: string;
          user_id: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          shipping_address: Json;
          subtotal: number;
          delivery_fee: number;
          total: number;
          status: OrderStatus;
          payment_method: string;
          payment_status: PaymentStatus;
          payment_provider: string | null;
          payment_reference: string | null;
          payment_payload: Json;
          notes: string | null;
        };
        Insert: Partial<Timestamped> & {
          id?: string;
          order_number?: string;
          user_id: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          shipping_address: Json;
          subtotal: number;
          delivery_fee?: number;
          total: number;
          status?: OrderStatus;
          payment_method?: string;
          payment_status?: PaymentStatus;
          payment_provider?: string | null;
          payment_reference?: string | null;
          payment_payload?: Json;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_slug: string | null;
          selected_size: string;
          quantity: number;
          unit_price: number;
          line_total: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_slug?: string | null;
          selected_size: string;
          quantity: number;
          unit_price: number;
          line_total: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      inquiries: {
        Row: Timestamped & {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          subject: string;
          message: string;
          status: 'new' | 'open' | 'resolved' | 'archived';
        };
        Insert: Partial<Timestamped> & {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          subject: string;
          message: string;
          status?: 'new' | 'open' | 'resolved' | 'archived';
        };
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>;
      };
      inventory_logs: {
        Row: {
          id: string;
          product_id: string;
          order_id: string | null;
          change: number;
          stock_after: number;
          reason: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          order_id?: string | null;
          change: number;
          stock_after: number;
          reason: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['inventory_logs']['Insert']>;
      };
    };
  };
}
