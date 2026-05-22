import { useEffect } from 'react';
import { Product } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  product?: Product;
}

export default function SEO({ title = 'Zenvor Premium Streetwear', description = 'Luxury dark streetwear from Sri Lanka. Heavyweight tees, architectural silhouettes, and premium essentials by Zenvor.', canonicalPath = '/', image = '/images/hero-zenvor.png', product }: SEOProps) {
  useEffect(() => {
    const siteUrl = window.location.origin;
    const canonical = `${siteUrl}${canonicalPath}`;
    const fullTitle = title.includes('Zenvor') ? title : `${title} | Zenvor`;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', product ? 'product' : 'website');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image.startsWith('http') ? image : `${siteUrl}${image}`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setLink('canonical', canonical);

    const existing = document.getElementById('product-jsonld');
    existing?.remove();
    if (product) {
      const script = document.createElement('script');
      script.id = 'product-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images?.length ? product.images.map((src) => src.startsWith('http') ? src : `${siteUrl}${src}`) : [`${siteUrl}${product.image}`],
        brand: { '@type': 'Brand', name: 'Zenvor' },
        sku: product.id,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'LKR',
          price: product.price,
          availability: (product.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: canonical,
        },
      });
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, image, product]);

  return null;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let node = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.content = value;
}

function setLink(rel: string, href: string) {
  let node = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!node) {
    node = document.createElement('link');
    node.rel = rel;
    document.head.appendChild(node);
  }
  node.href = href;
}
