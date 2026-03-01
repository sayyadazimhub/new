'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, Eye, Filter, Users, Phone, MapPin, Truck } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
// import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProviders = () => {
    setLoading(true);
    axios
      .get(`/api/user/providers?page=${pagination.page}&search=${search}`)
      .then((res) => {
        setProviders(res.data.providers || []);
        setPagination(res.data.pagination || { page: 1, pages: 1 });
      })
      .catch(() => toast.error('Failed to load providers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProviders();
  }, [pagination.page, search]);

  const handleOpen = (provider = null) => {
    setEditing(provider);
    setForm(
      provider
        ? { name: provider.name, phone: provider.phone || '', address: provider.address || '' }
        : { name: '', phone: '', address: '' }
    );
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await axios.put(`/api/user/providers/${editing.id}`, form);
        toast.success('Provider updated');
      } else {
        await axios.post('/api/user/providers', form);
        toast.success('Provider added');
      }
      setOpen(false);
      fetchProviders();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/user/providers/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchProviders();
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (provider) => {
    setViewing(provider);
    setLoadingDetails(true);
    try {
      const res = await axios.get(`/api/user/providers/${provider.id}`);
      setViewData(res.data);
    } catch (err) {
      toast.error('Failed to load details');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Provider?"
        description="Are you sure you want to delete this provider? All associated purchase records will also be affected."
        isLoading={submitting}
      />
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-slate-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-3xl font-black tracking-tight">Provider Registry</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2 font-medium">
            <Truck className="h-4 w-4" />
            Manage all providers and agricultural suppliers
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="relative bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-12 px-6 font-bold shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Register New Provider
        </Button>
      </div>

      {/* Registry Card - Exact Match with Product Page */}
      <Card className="border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden dark:border dark:border-slate-800">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="dark:text-slate-100">Provider List</CardTitle>
              <CardDescription className="dark:text-slate-400">View and manage your network of suppliers</CardDescription>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:text-slate-100"
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
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Provider Information</th>
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Contact Details</th>
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Location / Address</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {providers.map((f) => (
                    <tr key={f.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50">
                            {f.name[0]?.toUpperCase()}
                          </div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{f.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                          <Phone className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                          {f.phone || '—'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{f.address || '—'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(f)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpen(f)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteId(f.id)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {providers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <Truck className="h-8 w-8 text-slate-500 dark:text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium">No providers found in registry</p>
                          <Button onClick={() => handleOpen()} variant="outline" className="rounded-xl mt-2">
                            Register your first provider
                          </Button>
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

      {/* View Details Dialog */}
      <Dialog.Root open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm shadow-xl" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border-none bg-white dark:bg-slate-950 p-8 shadow-2xl dark:border dark:border-slate-800 overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
              Provider profile: {viewing?.name}
            </Dialog.Title>
            <Dialog.Description className="text-slate-500 dark:text-slate-400 mb-6">
              Complete transaction history and contact information
            </Dialog.Description>

            {loadingDetails ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : viewData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div>
                    <Label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</Label>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{viewData.phone || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Registered Address</Label>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{viewData.address || '—'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-4">Purchase History</h3>
                  {viewData.purchases?.length > 0 ? (
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                              <th className="p-3 text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Date</th>
                              <th className="p-3 text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Items</th>
                              <th className="p-3 text-right font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Unit Price</th>
                              <th className="p-3 text-right font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Total Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {viewData.purchases.map(purchase => (
                              <tr key={purchase.id} className="dark:bg-slate-950">
                                <td className="p-3 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                  {new Date(purchase.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                  {purchase.items.map(item => (
                                    <div key={item.id} className="text-slate-900 dark:text-slate-100 font-bold">
                                      {item.product.name} <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">x {item.quantity} {item.product.unit}</span>
                                    </div>
                                  ))}
                                </td>
                                <td className="p-3 text-right">
                                  {purchase.items.map(item => (
                                    <div key={item.id} className="text-slate-900 dark:text-slate-100 font-bold">
                                      ₹{item.unitPrice.toLocaleString()} <span className="text-slate-400 dark:text-slate-500 font-medium text-[10px]">/{item.product.unit}</span>
                                    </div>
                                  ))}
                                </td>
                                <td className="p-3 text-right font-black text-slate-900 dark:text-slate-100">
                                  ₹{purchase.totalAmount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 italic">
                      No purchase records found for this provider
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="outline" onClick={() => setViewing(null)} className="rounded-xl px-8 border-slate-200 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                    Close Profile
                  </Button>
                </div>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add/Edit Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-none bg-white dark:bg-slate-950 p-8 shadow-2xl dark:border dark:border-slate-800">
            <div className="flex flex-col gap-1 mb-6">
              <Dialog.Title className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {editing ? 'Update Provider' : 'Register Provider'}
              </Dialog.Title>
              <Dialog.Description className="text-slate-500 dark:text-slate-400">
                Enter contact details to maintain supplier relations
              </Dialog.Description>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name / Entity Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoFocus
                  className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600 dark:text-slate-100"
                  placeholder="e.g. John Doe Farms"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600 dark:text-slate-100"
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Registered Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600 dark:text-slate-100"
                  placeholder="Village, District, State"
                />
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button type="submit" disabled={submitting} className="flex-1 rounded-2xl h-12 font-bold bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl transition-all">
                  {submitting ? 'Saving…' : (editing ? 'Update Registry' : 'Save Provider')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-2xl h-12 px-6 border-slate-200 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  Cancel
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
