'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Lock,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Fingerprint,
  Smartphone,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Profile State
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });

  // Security State
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  // Preferences State
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingInitial(true);
    try {
      const [profileRes, settingsRes] = await Promise.all([
        axios.get('/api/user/profile'),
        axios.get('/api/user/settings')
      ]);
      setProfile(profileRes.data);
      setPreferences(settingsRes.data);
    } catch (err) {
      console.error('Failed to load settings data:', err);
      toast.error('Sync failed');
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/user/profile', {
        name: profile.name,
        phone: profile.phone
      });
      setProfile(res.data);
      toast.success('Identity updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error('Keys do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/user/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.next
      });
      toast.success('Credentials updated');
      setPasswords({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rotation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrefs = async () => {
    setLoading(true);
    try {
      const res = await axios.put('/api/user/settings', preferences);
      setPreferences(res.data);
      toast.success('Preferences saved');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/user/auth/logout');
      window.location.href = '/user/login';
    } catch (err) {
      window.location.href = '/user/login';
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      {/* Simple Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Settings</h1>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Configure your personal trading environment</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/30 font-bold text-[10px] uppercase tracking-widest transition-all bg-white dark:bg-slate-950"
        >
          Logout <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 transition-all">
        {[
          { id: 'profile', label: 'Identity', icon: UserIcon },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'prefs', label: 'Preferences', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-slate-200 dark:ring-slate-700"
                : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'profile' && (
          <Card className="border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Personal Identification</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Your visible profile information across the system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</Label>
                    <div className="relative group">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600 group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors" />
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="h-12 pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-slate-900 dark:focus:ring-slate-100 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">System Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600" />
                      <Input
                        value={profile.email}
                        className="h-12 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-600 font-bold cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Phone Number</Label>
                  <div className="relative group">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600 group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors" />
                    <Input
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-12 pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-slate-900 dark:focus:ring-slate-100 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <Button type="submit" disabled={loading} className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {loading ? 'Synthesizing...' : 'Save Profile Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-amber-500" />
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Authentication & Security</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Rotate your system access keys and passwords</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-8">
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Security Key</Label>
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-slate-900 dark:focus:ring-slate-100 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New System Key</Label>
                  <Input
                    type="password"
                    value={passwords.next}
                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-slate-900 dark:focus:ring-slate-100 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm New Key</Label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-slate-900 dark:focus:ring-slate-100 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <Button type="submit" disabled={loading} className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {loading ? 'Rotating...' : 'Rotate Security Keys'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'prefs' && preferences && (
          <Card className="border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Communication Preferences</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Control how the system interacts with you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { id: 'email', label: 'Email Reports', sub: 'Internal trade insights' },
                  { id: 'lowStock', label: 'Critical Stock', sub: 'Low inventory triggers' },
                  { id: 'newSale', label: 'Order Metrics', sub: 'Real-time sales alerts' },
                  { id: 'newPurchase', label: 'Logistics', sub: 'Stock arrival signals' },
                ].map((p) => (
                  <div key={p.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200/80 dark:hover:border-slate-700 transition-all duration-300">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.label}</Label>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{p.sub}</p>
                    </div>
                    <Switch
                      checked={preferences.notifications[p.id]}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          [p.id]: checked
                        }
                      })}
                      className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100"
                    />
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm transition-transform group-hover:rotate-12">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Privacy First Telemetry</p>
                  <p className="text-xs font-bold text-blue-900/60 dark:text-blue-300/60 leading-tight">Your notification preferences are synchronized securely across all active system nodes.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                <Button onClick={handleUpdatePrefs} disabled={loading} className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {loading ? 'Optimizing...' : 'Save Preferences Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="sm:hidden grid grid-cols-1 gap-4 pt-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl text-rose-600 border-rose-100 bg-rose-50/50 font-black text-xs uppercase tracking-[0.2em] transition-all"
        >
          Terminate Session <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
