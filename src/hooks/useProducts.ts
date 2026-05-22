import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { Product } from '../types';
import { mapProduct } from '../lib/commerce';
import { PRODUCTS } from '../data';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedProducts: Product[] = ((data as any[]) || []).map(mapProduct);

        setProducts(mappedProducts);
      } catch (err: any) {
        setError(err.message);
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`id.eq.${id},slug.eq.${id}`)
          .single();

        if (error) throw error;

        if (data) {
          setProduct(mapProduct(data));
        }
      } catch (err: any) {
        setError(err.message);
        const fallback = PRODUCTS.find((product) => product.id === id || product.slug === id);
        if (fallback) setProduct(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useFeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .eq('active', true)
          .limit(4);

        if (error) throw error;
        const mappedProducts: Product[] = ((data as any[]) || []).map(mapProduct);

        setFeaturedProducts(mappedProducts);
      } catch (err: any) {
        setError(err.message);
        setFeaturedProducts(PRODUCTS.filter((product) => product.featured).slice(0, 4));
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return { featuredProducts, loading, error };
}
