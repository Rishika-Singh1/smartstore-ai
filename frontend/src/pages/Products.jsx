import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CATEGORIES = ['Electronics','Fashion','Home & Garden','Sports','Beauty','Books','Toys','Food','Other'];

const emptyForm = { name:'', category:'Electronics', price:'', stock:'', description:'', tags:'' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // AI modal state
  const [aiModal, setAiModal] = useState(false);
  const [aiProduct, setAiProduct] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchProducts = async (q = '') => {
    try {
      const res = await api.get('/products', { params: { search: q } });
      setProducts(res.data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description || '', tags: (p.tags || []).join(', ') });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        toast.success('Product updated!');
      } else {
        await api.post('/products', form);
        toast.success('Product added!');
      }
      setModal(false);
      fetchProducts(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted!');
      fetchProducts(search);
    } catch {
      toast.error('Delete failed');
    }
  };

  const openAI = async (p) => {
    setAiProduct(p); setAiResult(null); setAiLoading(true); setAiModal(true);
    try {
      const res = await api.post('/ai/generate-content', {
        productName: p.name, category: p.category, price: p.price,
        features: p.tags?.join(', '), targetAudience: 'general consumers'
      });
      setAiResult(res.data.content);
    } catch {
      toast.error('AI generation failed');
      setAiModal(false);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAI = async () => {
    if (!aiResult || !aiProduct) return;
    try {
      await api.post(`/ai/apply-content/${aiProduct._id}`, {
        description: aiResult.description,
        tags: aiResult.tags,
        caption: aiResult.caption,
      });
      toast.success('AI content applied!');
      setAiModal(false);
      fetchProducts(search);
    } catch {
      toast.error('Failed to apply content');
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">Products</h2>
      <p className="text-gray-400 text-sm mt-1 mb-6">Manage your product catalog.</p>

      {/* Toolbar */}
      <div className="flex gap-3 mb-5">
        <input
          className="flex-1" placeholder="Search products..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : !products.length ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-sm">No products yet.</p>
          <button className="btn-primary mt-4" onClick={openAdd}>Add your first product</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="card relative">
              <span className={`absolute top-4 right-4 text-xs px-2 py-0.5 rounded ${p.stock <= 5 ? 'bg-warn/10 text-warn' : 'bg-accent2/10 text-accent2'}`}>
                {p.stock <= 5 ? `Low (${p.stock})` : `In Stock (${p.stock})`}
              </span>
              <span className="inline-block bg-accent2/10 border border-accent2/20 text-accent2 text-xs px-2 py-0.5 rounded mb-2">{p.category}</span>
              <h3 className="font-semibold text-white text-sm mb-1">{p.name}</h3>
              <p className="text-accent font-bold text-lg mb-2">${parseFloat(p.price).toFixed(2)}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3 min-h-[36px]">{p.description || 'No description yet.'}</p>
              {p.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => openAI(p)} className="text-xs px-3 py-1.5 rounded border border-accent/30 text-accent bg-accent/10 hover:bg-accent/20 transition-colors">✨ AI</button>
                <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 rounded border border-warn/20 text-warn bg-warn/8 hover:bg-warn/15 transition-colors">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-xs px-3 py-1.5 rounded border border-danger/20 text-danger bg-danger/8 hover:bg-danger/15 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-white text-lg mb-5">{editId ? 'Edit Product' : 'Add Product'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Product Name *</label>
                <input className="w-full" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Category</label>
                <select className="w-full" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price ($) *</label>
                <input className="w-full" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Stock Qty</label>
                <input className="w-full" type="number" placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea className="w-full" rows={3} placeholder="Product description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Tags (comma-separated)</label>
                <input className="w-full" placeholder="wireless, premium, gift" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {aiModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setAiModal(false)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-white text-lg mb-1">✨ AI Content</h3>
            <p className="text-gray-400 text-xs mb-5">For: <strong className="text-white">{aiProduct?.name}</strong></p>
            {aiLoading ? (
              <div className="text-center py-10 text-gray-400 text-sm">Generating content...</div>
            ) : aiResult && (
              <div className="space-y-3">
                <div className="ai-box">
                  <p className="text-xs text-accent uppercase tracking-wide mb-2">📝 Description</p>
                  <p className="text-sm text-gray-200 leading-relaxed">{aiResult.description}</p>
                </div>
                <div className="ai-box">
                  <p className="text-xs text-accent uppercase tracking-wide mb-2">🔍 SEO Tags</p>
                  <div className="flex flex-wrap gap-1">{aiResult.tags?.map(t => <span key={t} className="tag-pill">{t}</span>)}</div>
                </div>
                <div className="ai-box">
                  <p className="text-xs text-accent uppercase tracking-wide mb-2">📣 Marketing Caption</p>
                  <p className="text-sm text-gray-200 leading-relaxed">{aiResult.caption}</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end mt-5">
              <button className="btn-secondary" onClick={() => setAiModal(false)}>Close</button>
              {aiResult && <button className="btn-primary" onClick={applyAI}>Apply to Product</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}