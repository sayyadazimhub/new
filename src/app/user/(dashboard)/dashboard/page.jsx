'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, ShoppingCart, Wallet, AlertTriangle, Calendar, Package, ArrowUpRight, ArrowDownRight, Users, Truck, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('today'); // Default to today

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  const fetchDashboardData = (selectedPeriod) => {
    setLoading(true);

    // Calculate dates
    const end = new Date();
    const start = new Date();

    if (selectedPeriod === 'today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (selectedPeriod === '7' || selectedPeriod === 'weekly') {
      start.setDate(end.getDate() - 7);
    } else if (selectedPeriod === '30' || selectedPeriod === 'daily') {
      start.setDate(end.getDate() - 30);
    } else if (selectedPeriod === 'month') {
      start.setDate(1); // 1st of current month
      start.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === 'year') {
      start.setMonth(0, 1); // Jan 1st
      start.setHours(0, 0, 0, 0);
    }

    const query = new URLSearchParams({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    fetch(`/api/user/dashboard?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const s = data?.summary || {};
  const lowStock = data?.lowStockProducts || [];
  const recent = data?.recentTransactions || {};
  const chartData = data?.chartData || [];
  const topProducts = data?.topProducts || [];
  const topCustomers = data?.topCustomers || [];
  const topProviders = data?.topProviders || [];

  const stats = [
    {
      label: 'Gross Profit',
      value: `₹${Number(s.totalProfit || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      bgColor: 'bg-emerald-500',
      iconColor: 'text-white',
      gradient: 'from-emerald-50 to-white',
      accentColor: 'emerald'
    },
    {
      label: 'Total Revenue',
      value: `₹${Number(s.totalSales || 0).toLocaleString('en-IN')}`,
      icon: ShoppingCart,
      bgColor: 'bg-blue-500',
      iconColor: 'text-white',
      gradient: 'from-blue-50 to-white',
      accentColor: 'blue'
    },
    {
      label: 'Receivables',
      value: `₹${Number(s.totalDueFromCustomers || 0).toLocaleString('en-IN')}`,
      icon: ArrowUpRight,
      bgColor: 'bg-violet-500',
      iconColor: 'text-white',
      gradient: 'from-violet-50 to-white',
      accentColor: 'violet'
    },
    {
      label: 'Payables',
      value: `₹${Number(s.totalDueToProviders || 0).toLocaleString('en-IN')}`,
      icon: ArrowDownRight,
      bgColor: 'bg-amber-500',
      iconColor: 'text-white',
      gradient: 'from-amber-50 to-white',
      accentColor: 'amber'
    },
  ];

  const pieData = [
    { name: 'Sales', value: s.totalSales || 0, color: '#10b981' },
    { name: 'Purchases', value: s.totalPurchases || 0, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Minimalist Premium Header */}
      <div className="flex flex-col px-5 sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Analytics Dashboard</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Business Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px] h-8 border-none bg-transparent p-0 text-xs font-black uppercase tracking-wider focus:ring-0 dark:text-slate-200">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                <SelectItem value="today" className="text-xs font-bold uppercase">Today</SelectItem>
                <SelectItem value="weekly" className="text-xs font-bold uppercase">This Week</SelectItem>
                <SelectItem value="30" className="text-xs font-bold uppercase">Last 30 Days</SelectItem>
                <SelectItem value="month" className="text-xs font-bold uppercase">This Month</SelectItem>
                <SelectItem value="year" className="text-xs font-bold uppercase">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className={`border-none shadow-sm dark:shadow-none relative overflow-hidden group hover:shadow-md dark:shadow-white/5 transition-all`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} dark:from-slate-900 dark:to-slate-950 opacity-50 dark:opacity-100`} />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${item.bgColor} shadow-lg dark:shadow-none group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black tracking-tight dark:text-slate-100">Financial Trends</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider dark:text-slate-500">Revenue and Profitability Analytics</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Profit</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={0} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      dy={10}
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      fontSize={11}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(value) => value === 0 ? '0' : `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-2xl text-slate-900 dark:text-white min-w-[160px]">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">{new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-xs font-bold text-slate-300">Sales</span>
                                  </div>
                                  <span className="text-sm font-black text-emerald-400">₹{payload[0].value.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                    <span className="text-xs font-bold text-slate-300">Profit</span>
                                  </div>
                                  <span className="text-sm font-black text-violet-400">₹{payload[1].value.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#10b981"
                      radius={[6, 0, 0, 0]}
                      name="Sales"
                      maxBarSize={40}
                    />
                    <Bar
                      dataKey="profit"
                      fill="#8b5cf6"
                      radius={[0, 6, 0, 0]}
                      name="Profit"
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No data for this period</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg font-black tracking-tight dark:text-slate-100">Market Balance</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider dark:text-slate-500">Sale vs Purchase Distribution</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-[250px] w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 shadow-2xl text-slate-900 dark:text-white">
                              <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{payload[0].name}</p>
                              <p className="text-sm font-black">₹{payload[0].value.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
            <div className="mt-4 w-full grid grid-cols-2 gap-4">
              {pieData.map(item => (
                <div key={item.name} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{item.name}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100">₹{item.value.toLocaleString()}</span>
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Selling Products */}
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50">
          <CardHeader className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Top Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topProducts.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {topProducts.map((p, idx) => (
                  <div key={p.productId} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-slate-200 dark:text-slate-800">0{idx + 1}</span>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{p.totalQuantity} {p.unit} moved</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-emerald-600 dark:text-emerald-400">₹{p.totalProfit?.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Profit</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50">
          <CardHeader className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Top Customers</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topCustomers.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {topCustomers.map((c, idx) => (
                  <div key={c.customerId} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-slate-200 dark:text-slate-800">0{idx + 1}</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-slate-900 dark:text-slate-100">₹{c.totalAmount?.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Top Providers */}
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50">
          <CardHeader className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Top Providers</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topProviders.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {topProviders.map((p, idx) => (
                  <div key={p.providerId} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-slate-200 dark:text-slate-800">0{idx + 1}</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-slate-900 dark:text-slate-100">₹{p.totalAmount?.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Purchase</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Stream */}
        <Card className="lg:col-span-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-lg font-black tracking-tight dark:text-slate-100">Recent Activity</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider dark:text-slate-500">Latest sales and acquisitions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-[10px] font-black uppercase dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800" asChild>
                <a href="/user/sales">Sales</a>
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-[10px] font-black uppercase dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800" asChild>
                <a href="/user/purchases">Purchases</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...(recent.sales || []).map(s => ({ ...s, type: 'sale' })), ...(recent.purchases || []).map(p => ({ ...p, type: 'purchase' }))]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 8)
                .map((item) => (
                  <div key={`${item.type}-${item.id}`} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${item.type === 'sale' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                          {item.type === 'sale' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {item.type === 'sale' ? (item.customer?.name || 'Walk-in') : (item.provider?.name || 'Unknown')}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                            {item.type === 'sale' ? 'Sale Transaction' : 'Stock Purchase'} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-sm ${item.type === 'sale' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          ₹{Number(item.totalAmount).toLocaleString()}
                        </p>
                        <div className="flex flex-wrap justify-end gap-1 mt-1">
                          {item.items.slice(0, 2).map((li, idx) => (
                            <span key={idx} className="text-[8px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                              {li.product.name}
                            </span>
                          ))}
                          {item.items.length > 2 && <span className="text-[8px] font-black text-slate-400 dark:text-slate-500">+{item.items.length - 2} More</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {!recent.sales?.length && !recent.purchases?.length && (
                <div className="py-20 text-center text-slate-400 dark:text-slate-500 text-sm">No recent activity detected</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Alerts & Stock */}
        <div className="space-y-6">
          <Card className="border-amber-100 dark:border-amber-900 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-amber-950/20">
            <CardHeader className="bg-amber-500 dark:bg-amber-600 border-b border-amber-600 dark:border-amber-700 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-white" />
                  <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Low Stock</CardTitle>
                </div>
                <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full uppercase">{lowStock.length} Alerts</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {lowStock.length > 0 ? (
                <div className="divide-y divide-amber-50 dark:divide-amber-900/30">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-amber-50/30 dark:bg-amber-900/10">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.name}</span>
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">{p.currentStock} {p.unit}</span>
                        <p className="text-[8px] font-bold text-amber-500 dark:text-amber-600 uppercase">Remaining</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-4">
                    <Button variant="outline" className="w-full h-10 rounded-2xl border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-xs font-black uppercase" asChild>
                      <a href="/user/stock" className="flex items-center justify-center w-full h-full text-center">Manage Inventory</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">All stocks sufficient</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 dark:bg-slate-950 border-none shadow-xl rounded-3xl p-6 text-white relative overflow-hidden border dark:border-slate-800">
            <div className="absolute top-0 right-0 -m-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Quick Insights</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Net Margin</span>
                  <span className="text-sm font-black text-emerald-400">
                    {s.totalSales > 0 ? ((s.totalProfit / s.totalSales) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Total Due</span>
                  <span className="text-sm font-black text-rose-400">
                    ₹{(s.totalDueToProviders + s.totalDueFromCustomers).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 h-10 rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-900/40" asChild>
                <a href={`/user/reports?type=${period}`} className="flex items-center justify-center w-full h-full text-center">
                  Generate Full Report
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
