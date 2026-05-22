import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { getSupabase } from '../lib/supabase';
import { mapProduct } from '../lib/commerce';

interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zenvor_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [remoteCartId, setRemoteCartId] = useState<string | null>(null);
  const [hydratingRemoteCart, setHydratingRemoteCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('zenvor_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    async function loadRemoteCart() {
      const supabase = getSupabase();
      if (!supabase || authLoading || !user) return;

      setHydratingRemoteCart(true);
      try {
        const { data: existingCart, error: findError } = await (supabase as any)
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (findError) throw findError;

        const { data: cart, error: cartError } = existingCart
          ? { data: existingCart, error: null }
          : await (supabase as any)
          .from('carts')
          .insert({ user_id: user.id, status: 'active' })
          .select('id')
          .single();

        if (cartError) throw cartError;
        setRemoteCartId(cart.id);

        const { data: items, error: itemsError } = await (supabase as any)
          .from('cart_items')
          .select('id, quantity, selected_size, products(*)')
          .eq('cart_id', cart.id);

        if (itemsError) throw itemsError;

        const remoteItems = ((items as any[]) || [])
          .filter((item) => item.products?.active)
          .map((item) => ({
            ...mapProduct(item.products),
            cartItemId: item.id,
            quantity: item.quantity,
            selectedSize: item.selected_size,
          }));

        if (remoteItems.length > 0) {
          setCartItems(remoteItems);
        }
      } catch (error) {
        console.error('Unable to load customer cart:', error);
      } finally {
        setHydratingRemoteCart(false);
      }
    }

    loadRemoteCart();
  }, [authLoading, user]);

  useEffect(() => {
    async function syncRemoteCart() {
      const supabase = getSupabase();
      if (!supabase || !user || !remoteCartId || hydratingRemoteCart) return;

      try {
        await (supabase as any).from('cart_items').delete().eq('cart_id', remoteCartId);

        if (cartItems.length === 0) return;

        const rows = cartItems.map((item) => ({
          cart_id: remoteCartId,
          product_id: item.id,
          selected_size: item.selectedSize,
          quantity: item.quantity,
        }));

        const { error } = await (supabase as any).from('cart_items').insert(rows);
        if (error) throw error;
      } catch (error) {
        console.error('Unable to sync customer cart:', error);
      }
    }

    const timer = window.setTimeout(syncRemoteCart, 350);
    return () => window.clearTimeout(timer);
  }, [cartItems, hydratingRemoteCart, remoteCartId, user]);

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        addToast(`Updated quantity for ${product.name}`, 'success');
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      addToast(`Added ${product.name} to cart`, 'success');
      return [
        ...prev,
        {
          ...product,
          cartItemId: `${product.id}-${size}-${Date.now()}`,
          quantity,
          selectedSize: size,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    addToast('Cart cleared', 'info');
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
