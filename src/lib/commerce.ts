import { CartItem, OrderTotals, Product } from '../types';

export const DELIVERY_FEE = 350;
export const FREE_DELIVERY_THRESHOLD = 10000;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function calculateOrderTotals(items: CartItem[]): OrderTotals {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export function mapProduct(row: any): Product {
  const normalizedImages = Array.isArray(row.product_images)
    ? row.product_images
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((image: any) => image.image_url)
        .filter(Boolean)
    : [];
  const gallery = normalizedImages.length ? normalizedImages : row.gallery_images || row.images || [];
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category || 'Streetwear',
    image: row.image_url || gallery[0] || '/images/1/1.png',
    images: gallery.length ? gallery : row.image_url ? [row.image_url] : [],
    description: row.description || '',
    fabric: row.fabric || undefined,
    fit: row.fit || row.category || undefined,
    gsm: row.gsm ? Number(row.gsm) : undefined,
    stock: row.stock ?? undefined,
    active: row.active,
    featured: row.featured,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    sizes: row.sizes || ['S', 'M', 'L', 'XL'],
    colors: row.colors || [],
    series: row.series || undefined,
  };
}

export function productToAdminPayload(product: Product) {
  return {
    id: product.id || slugify(product.name),
    slug: product.slug || slugify(product.name),
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    fabric: product.fabric || null,
    fit: product.fit || null,
    gsm: product.gsm || null,
    sizes: product.sizes,
    stock: product.stock || 0,
    image_url: product.image,
    gallery_images: product.images || [product.image],
    colors: product.colors || [],
    active: product.active ?? true,
    featured: product.featured ?? false,
    seo_title: product.seoTitle || product.name,
    seo_description: product.seoDescription || product.description,
  };
}
