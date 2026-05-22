import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function SalesManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [salesForm, setSalesForm] = useState({});
  const [savingId, setSavingId] = useState(null);

  const fetchProducts = async (q = '') => {
    try {
      const res = await api.get('/products', { params: { search: q } });
      setProducts(res.data.products);
      
      // Initialize inputs from fetched values if not already touched
      const initialSales = {};
      res.data.products.forEach(p => {
        initialSales[p._id] = p.unitsSold;
      });
      setSalesForm(prev => {
        const nextState = { ...initialSales };
        // Keep user modified values that haven't been saved yet
        Object.keys(prev).forEach(key => {
          if (prev[key] !== undefined) {
            nextState[key] = prev[key];
          }
        });
        return nextState;
      });
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleInputChange = (id, val) => {
    const parsed = parseInt(val);
    setSalesForm(prev => ({
      ...prev,
      [id]: isNaN(parsed) ? '' : Math.max(0, parsed)
    }));
  };

  const handleSaveSales = async (id, originalProduct) => {
    const newUnitsSold = salesForm[id];
    if (newUnitsSold === undefined || newUnitsSold === '') {
      toast.error('Please enter a valid number of units sold');
      return;
    }
    setSavingId(id);
    try {
      await api.put(`/products/${id}`, {
        ...originalProduct,
        unitsSold: newUnitsSold
      });
      toast.success('Sales updated successfully!');
      
      // Clear salesForm for this product to reset dirty state
      setSalesForm(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      
      fetchProducts(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update sales');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">Sales Manager</h2>
      <p className="text-gray-400 text-sm mt-1 mb-6">Track product sales and record units sold to generate store revenue.</p>

      {/* Search Toolbar */}
      <div className="flex gap-3 mb-5">
        <input
          className="flex-1"
          placeholder="Search products by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid/Table */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading products...</p>
      ) : !products.length ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-sm">No products found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-gray-500 tracking-wider">
                  <th className="py-3.5 px-4 font-semibold text-gray-400">Product</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-400">Category</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-400">Unit Price</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-400">Stock Left</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-400 w-44">Units Sold</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-400">Projected Revenue</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm text-gray-300">
                {products.map(p => {
                  const currentInputVal = salesForm[p._id] !== undefined ? salesForm[p._id] : p.unitsSold;
                  const projectedRevenue = (parseInt(currentInputVal) || 0) * p.price;
                  const isDirty = currentInputVal !== p.unitsSold;

                  return (
                    <tr key={p._id} className="hover:bg-accent/5 transition-colors group">
                      <td className="py-4 px-4 font-medium text-white">{p.name}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-accent2/10 border border-accent2/20 text-accent2 text-xs px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">${parseFloat(p.price).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded ${p.stock <= 5 ? 'bg-warn/10 text-warn' : 'bg-gray-700/50 text-gray-400'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          min="0"
                          className="w-28 bg-bg border border-border rounded-lg px-2 py-1 text-white text-xs outline-none focus:border-accent"
                          value={currentInputVal}
                          onChange={e => handleInputChange(p._id, e.target.value)}
                        />
                      </td>
                      <td className="py-4 px-4 font-semibold text-accent">
                        ${projectedRevenue.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleSaveSales(p._id, p)}
                          disabled={savingId === p._id || !isDirty}
                          className={`text-xs font-semibold px-3 py-1.5 rounded transition-all duration-200 ${
                            isDirty 
                              ? 'bg-accent text-white hover:opacity-90 shadow-md shadow-accent/10 cursor-pointer' 
                              : 'bg-transparent border border-border text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {savingId === p._id ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
