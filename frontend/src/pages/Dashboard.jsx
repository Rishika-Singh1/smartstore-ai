import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const COLORS = ['#6c63ff','#00d4aa','#ffc857','#ff5f6d','#48cae4','#fb8b24','#9b5de5','#f15bb5'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading dashboard...</div>
  );

  const cats = stats ? Object.keys(stats.revenueByCategory) : [];
  const revVals = cats.map(c => stats.revenueByCategory[c]);
  const pieCats = stats ? Object.keys(stats.productsByCategory) : [];
  const pieVals = pieCats.map(c => stats.productsByCategory[c]);

  const barData = {
    labels: cats,
    datasets: [{
      data: revVals,
      backgroundColor: COLORS.slice(0, cats.length),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const pieData = {
    labels: pieCats,
    datasets: [{
      data: pieVals,
      backgroundColor: COLORS,
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a85a3', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a85a3', font: { size: 11 }, callback: v => '$' + v.toLocaleString() } },
    },
  };

  const pieOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#7a85a3', font: { size: 11 }, padding: 12 }, position: 'bottom' } },
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">Dashboard</h2>
      <p className="text-gray-400 text-sm mt-1 mb-6">Your store overview at a glance.</p>

      {/* Low stock alert */}
      {stats?.lowStockProducts?.length > 0 && (
        <div className="flex items-center gap-3 bg-warn/8 border border-warn/30 rounded-xl px-4 py-3 mb-5">
          <svg className="w-5 h-5 text-warn flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-warn text-sm">
            <strong>Low Stock:</strong> {stats.lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(', ')}
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '$' + (stats?.totalRevenue || 0).toLocaleString('en', { maximumFractionDigits: 0 }), change: '+12% this month', up: true },
          { label: 'Total Products', value: stats?.totalProducts || 0, change: 'Active listings', up: true },
          { label: 'Top Product', value: stats?.topProduct?.name || '—', change: stats?.topProduct ? '$' + stats.topProduct.revenue + ' revenue' : '—', up: true },
          { label: 'Avg. Price', value: '$' + (stats?.avgPrice || 0).toFixed(2), change: 'Per product', up: true },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-white leading-tight">{s.value}</p>
            <p className={`text-xs mt-1 ${s.up ? 'text-accent2' : 'text-danger'}`}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        <div className="card col-span-3">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue by Category</h3>
          {cats.length ? <Bar data={barData} options={chartOpts} /> : <p className="text-gray-500 text-sm">No data yet.</p>}
        </div>
        <div className="card col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Product Distribution</h3>
          {pieCats.length ? <Doughnut data={pieData} options={pieOpts} /> : <p className="text-gray-500 text-sm">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}