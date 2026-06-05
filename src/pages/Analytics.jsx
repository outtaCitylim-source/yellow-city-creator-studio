import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    completionRate: 0,
    revenueData: [],
    ordersByStatus: [],
    topServices: [],
    customerSegments: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  }

  const COLORS = ['#d4af37', '#1a1a1a', '#666666', '#999999'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-600 mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-yellow-600">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <p className="text-gray-400 text-sm">Avg Order Value</p>
            <p className="text-3xl font-bold text-yellow-600">${stats.avgOrderValue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Per order</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <p className="text-gray-400 text-sm">Completion Rate</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-2">Orders completed</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }} />
                <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders by Status */}
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Orders by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }} />
                <Bar dataKey="count" fill="#d4af37" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Services */}
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Top Decoration Methods</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.topServices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#d4af37"
                  dataKey="value"
                >
                  {stats.topServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Segments */}
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-600/20">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Customer Segments</h2>
            <div className="space-y-4">
              {stats.customerSegments.map((segment, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-300">{segment.name}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${(segment.count / stats.totalOrders) * 100}%` }}
                      />
                    </div>
                    <span className="text-yellow-600 font-bold w-12 text-right">{segment.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition"
          >
            Print Report
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(stats, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-6 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition font-bold"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
