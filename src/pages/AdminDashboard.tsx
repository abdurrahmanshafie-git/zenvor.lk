import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Edit3, Package, Plus, Power, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { getSupabase } from '../lib/supabase';
import { mapProduct, productToAdminPayload, slugify } from '../lib/commerce';
import { PRODUCTS } from '../data';
import { useToast } from '../context/ToastContext';

const blankProduct: Product = {
  id: '',
  slug: '',
  name: '',
  price: 0,
  category: 'Drop Shoulder',
  image: '/images/1/1.png',
  images: ['/images/1/1.png'],
  description: '',
  fabric: '',
  fit: '',
  gsm: 300,
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [],
  stock: 0,
  active: true,
  featured: false,
};

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>(blankProduct);
  const [saving, setSaving] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const supabase = useMemo(() => getSupabase(), []);

  const loadProducts = async () => {
    if (!supabase) {
      setProducts(PRODUCTS);
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      addToast(error.message, 'error');
      setLoadingProducts(false);
      return;
    }
    setProducts(((data as any[]) || []).map(mapProduct));
    setLoadingProducts(false);
  };

  useEffect(() => {
    if (!loading && user && profile?.role === 'admin') loadProducts();
  }, [loading, user, profile?.role]);

  if (loading) {
    return (
      <div className="bg-brand-charcoal min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  if (profile?.role !== 'admin') {
    navigate('/account', { replace: true });
    return null;
  }

  const updateField = (key: keyof Product, value: any) => {
    setEditing((prev) => ({
      ...prev,
      [key]: value,
      slug: key === 'name' && !prev.slug ? slugify(value) : prev.slug,
      id: key === 'name' && !prev.id ? slugify(value) : prev.id,
    }));
  };

  const saveProduct = async () => {
    if (!editing.name || !editing.price) {
      addToast('Name and price are required.', 'error');
      return;
    }
    setSaving(true);
    const payload = productToAdminPayload(editing);
    const { error } = await supabase!.from('products').upsert(payload);
    if (error) {
      setSaving(false);
      addToast(error.message, 'error');
      return;
    }
    await supabase!.from('product_images').delete().eq('product_id', payload.id);
    const imageRows = (payload.gallery_images.length ? payload.gallery_images : [payload.image_url]).map((imageUrl, index) => ({
      product_id: payload.id,
      image_url: imageUrl,
      alt_text: payload.name,
      sort_order: index,
      is_primary: index === 0,
    }));
    const { error: imageError } = await supabase!.from('product_images').insert(imageRows);
    setSaving(false);
    if (imageError) {
      addToast(imageError.message, 'error');
      return;
    }
    addToast('Product saved.', 'success');
    setEditing(blankProduct);
    loadProducts();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase!.from('products').delete().eq('id', id);
    if (error) addToast(error.message, 'error');
    else {
      addToast('Product deleted.', 'info');
      loadProducts();
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase!.from('products').update({ active: !product.active }).eq('id', product.id);
    if (error) addToast(error.message, 'error');
    else loadProducts();
  };

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-gold mb-4">ADMIN CMS</p>
            <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter">PRODUCTS.</h1>
          </div>
          <Link to="/admin/orders" className="premium-btn-outline h-14">Manage Orders</Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-5 bg-brand-pitch border border-white/5 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 text-brand-gold">
              <Plus size={18} />
              <h2 className="text-sm uppercase tracking-[0.3em] font-black">Product Editor</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="Name" value={editing.name} onChange={(v) => updateField('name', v)} />
              <AdminInput label="Slug" value={editing.slug} onChange={(v) => updateField('slug', v)} />
              <AdminInput label="Price" type="number" value={editing.price} onChange={(v) => updateField('price', Number(v))} />
              <AdminInput label="Category" value={editing.category} onChange={(v) => updateField('category', v)} />
              <AdminInput label="Fabric" value={editing.fabric || ''} onChange={(v) => updateField('fabric', v)} />
              <AdminInput label="Fit" value={editing.fit || ''} onChange={(v) => updateField('fit', v)} />
              <AdminInput label="GSM" type="number" value={editing.gsm || 0} onChange={(v) => updateField('gsm', Number(v))} />
              <AdminInput label="Stock" type="number" value={editing.stock || 0} onChange={(v) => updateField('stock', Number(v))} />
              <AdminInput label="Sizes CSV" value={editing.sizes.join(', ')} onChange={(v) => updateField('sizes', v.split(',').map((x) => x.trim()).filter(Boolean))} />
              <AdminInput label="Image URL" value={editing.image} onChange={(v) => updateField('image', v)} />
            </div>
            <AdminInput label="Gallery URLs CSV" value={(editing.images || []).join(', ')} onChange={(v) => updateField('images', v.split(',').map((x) => x.trim()).filter(Boolean))} />
            <textarea value={editing.description} onChange={(e) => updateField('description', e.target.value)} placeholder="DESCRIPTION" className="admin-field min-h-28" />
            <div className="flex flex-wrap gap-4">
              <label className="admin-check"><input type="checkbox" checked={!!editing.active} onChange={(e) => updateField('active', e.target.checked)} /> Active</label>
              <label className="admin-check"><input type="checkbox" checked={!!editing.featured} onChange={(e) => updateField('featured', e.target.checked)} /> Featured</label>
            </div>
            <button onClick={saveProduct} disabled={saving} className="premium-btn w-full h-14">{saving ? 'Saving...' : 'Save Product'}</button>
          </div>

          <div className="xl:col-span-7 space-y-4">
            {loadingProducts && (
              <div className="bg-brand-pitch border border-white/5 p-16 text-center text-brand-subtext">
                <div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-5" />
                Loading products...
              </div>
            )}
            {!loadingProducts && products.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="bg-brand-pitch border border-white/5 p-4 md:p-6 flex gap-5 items-center">
                <img src={product.image} alt={product.name} loading="lazy" className="w-20 aspect-[3/4] object-cover bg-brand-graphite" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm uppercase tracking-widest font-black text-white truncate">{product.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext mt-1">LKR {product.price}.00 / {product.stock ?? 0} stock / {product.active ? 'active' : 'hidden'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(product)} className="admin-icon"><Edit3 size={16} /></button>
                  <button onClick={() => toggleActive(product)} className="admin-icon"><Power size={16} /></button>
                  <button onClick={() => deleteProduct(product.id)} className="admin-icon text-red-400"><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))}
            {!loadingProducts && products.length === 0 && <div className="bg-brand-pitch border border-white/5 p-16 text-center text-brand-subtext"><Package className="mx-auto mb-4" />No products yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, type = 'text' }: { label: string; value: string | number; type?: string; onChange: (value: string) => void }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={label.toUpperCase()} className="admin-field" />;
}
