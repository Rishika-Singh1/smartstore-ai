import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CATEGORIES = ['Electronics','Fashion','Home & Garden','Sports','Beauty','Books','Toys','Food','Other'];

export default function AIContent() {
  const [form, setForm] = useState({ productName:'', category:'Electronics', targetAudience:'', features:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!form.productName.trim()) { toast.error('Enter a product name'); return; }
    setLoading(true); setResult(null);
    try {
      const res = await api.post('/ai/generate-content', form);
      setResult(res.data.content);
      toast.success('Content generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied!'); };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">AI Content Generator</h2>
      <p className="text-gray-400 text-sm mt-1 mb-6">Generate product descriptions, SEO tags, and captions using AI.</p>

      <div className="card mb-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Product Name *</label>
            <input className="w-full" placeholder="e.g. Wireless Noise-Cancelling Headphones"
              value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Category</label>
            <select className="w-full" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Target Audience</label>
            <input className="w-full" placeholder="e.g. remote workers, students"
              value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Key Features (comma-separated)</label>
            <input className="w-full" placeholder="e.g. 30hr battery, active noise cancellation, foldable"
              value={form.features} onChange={e => setForm({...form, features: e.target.value})} />
          </div>
        </div>
        <button className="btn-primary w-full mt-5" onClick={generate} disabled={loading}>
          {loading ? '⏳ Generating...' : '✨ Generate AI Content'}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Description */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-accent uppercase tracking-wide font-semibold">📝 Product Description</p>
              <button onClick={() => copy(result.description)} className="text-xs text-gray-500 hover:text-white transition-colors">Copy</button>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{result.description}</p>
          </div>

          {/* Tags */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-accent uppercase tracking-wide font-semibold">🔍 SEO Tags</p>
              <button onClick={() => copy(result.tags?.join(', '))} className="text-xs text-gray-500 hover:text-white transition-colors">Copy</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.tags?.map(t => <span key={t} className="tag-pill text-sm py-1 px-3">{t}</span>)}
            </div>
          </div>

          {/* Caption */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-accent uppercase tracking-wide font-semibold">📣 Marketing Caption</p>
              <button onClick={() => copy(result.caption)} className="text-xs text-gray-500 hover:text-white transition-colors">Copy</button>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{result.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}