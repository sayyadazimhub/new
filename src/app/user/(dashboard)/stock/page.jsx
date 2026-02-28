'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Search,
  AlertTriangle,
  Package,
  Filter,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  XCircle,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function StockMonitorPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  const toggleExpand = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(`/api/user/products?page=${pagination.page}&search=${search}&limit=50`)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, search]);

  // Derived stats
  const lowStockCount = products.filter(p => p.currentStock <= 10).length;

  const filteredProducts = filterLowStock
    ? products.filter(p => p.currentStock <= 10)
    : products;

  const getStatusBadge = (stock) => {
    if (stock <= 0) return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 px-3 py-1 text-[10px] font-black text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 uppercase tracking-widest">
        <XCircle className="h-3 w-3" /> DEPLETED
      </span>
    );
    if (stock <= 10) return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-[10px] font-black text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 uppercase tracking-widest">
        <AlertTriangle className="h-3 w-3" /> CRITICAL
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[10px] font-black text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 uppercase tracking-widest">
        <CheckCircle2 className="h-3 w-3" /> STABLE
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section - Exact Match with Product Page */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-slate-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-3xl font-black tracking-tight">Inventory Monitor</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Live stock tracking and inventory monitoring
          </p>
        </div>
        <Link href="/user/products">
          <Button className="relative bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-12 px-6 font-bold shadow-lg">
            <Package className="mr-2 h-5 w-5" />
            Manage Products
          </Button>
        </Link>
      </div>

      {/* Summary Cards - Styled to match Product Page color scheme */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className={cn(
          "border-none shadow-md text-white overflow-hidden relative group transition-all",
          lowStockCount > 0 ? "bg-amber-500 shadow-amber-200/50" : "bg-emerald-600 shadow-emerald-200/50"
        )}>
          <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold opacity-80 uppercase tracking-widest">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{lowStockCount} Items</div>
            <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-tight">
              {lowStockCount > 0 ? "Action required immediately" : "All levels are optimal"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-slate-900/50 dark:border dark:border-slate-800 text-slate-900 dark:text-slate-100 relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl dark:bg-blue-500/10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total SKU Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{products.length} Products</div>
            <Link href="/user/products" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 mt-2 uppercase tracking-tighter">
              View Catalog <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Registry Card - Exact Match with Product Page */}
      <Card className="border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden dark:border dark:border-slate-800">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 pb-6">
          <div>
            <CardTitle className="flex items-center gap-2 dark:text-slate-100">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              Inventory Registry
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Real-time stock levels across your catalog</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              variant={filterLowStock ? "destructive" : "outline"}
              size="sm"
              onClick={() => setFilterLowStock(!filterLowStock)}
              className="rounded-xl h-11 px-6 font-bold w-full sm:w-auto transition-all"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {filterLowStock ? "View All Stock" : "Low Stock Only"}
            </Button>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-blue-500 dark:text-slate-100"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm text-slate-600 dark:text-slate-400">
                <thead>
                  <tr className="border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Product Information</th>
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Availability Status</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Total Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((p) => (
                    <>
                      <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer" onClick={() => toggleExpand(p.id)}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50">
                              {p.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{p.name}</p>
                                {p.batches?.length > 1 && (
                                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-tight">
                                    {p.batches.length} BATCHES
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Unit: {p.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            {getStatusBadge(p.currentStock)}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <div className="flex flex-col items-end">
                              <span className={cn(
                                "font-mono font-black text-lg",
                                p.currentStock <= 10 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-100"
                              )}>
                                {p.currentStock.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{p.unit} total</span>
                            </div>
                            {expandedProducts.has(p.id) ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          </div>
                        </td>
                      </tr>
                      {expandedProducts.has(p.id) && (
                        <tr className="bg-slate-50/50 dark:bg-slate-900/20 animate-in slide-in-from-top-1 duration-200">
                          <td colSpan={3} className="p-0 border-b dark:border-slate-800">
                            <div className="p-4 pl-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {p.batches && p.batches.length > 0 ? p.batches.map((batch, idx) => (
                                <div key={batch.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                                      <History className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Batch {idx + 1}
                                      </p>
                                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                        Price: ₹{batch.purchasePrice}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</p>
                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{batch.quantity} {p.unit}</p>
                                  </div>
                                </div>
                              )) : (
                                <p className="text-xs text-slate-400 py-2">No active batches for this product</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Package className="h-12 w-12 text-slate-200" />
                          <p className="text-slate-400 font-medium">No inventory data matches your criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="p-6 border-t dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/10 dark:bg-slate-900/50">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 h-9 font-bold bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 h-9 font-bold border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
