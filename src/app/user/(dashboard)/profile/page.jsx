'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  MapPin,
  Shield,
  ArrowRight,
  BadgeCheck,
  UserCheck,
  CheckCircle2,
  Link
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    axios
      .get('/api/user/profile')
      .then((res) => {
        setProfile(res.data);
        setFormData({ name: res.data.name, phone: res.data.phone || '' });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put('/api/user/profile', formData);
      setProfile(res.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Profile not found</h2>
          <p className="text-muted-foreground mt-2">There was an issue loading your profile.</p>
          <Button onClick={fetchProfile} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section - Exact Match with Stock Page */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-slate-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-3xl font-black tracking-tight">User Profile</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Manage your personal identity and security settings
          </p>
        </div>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            className="relative bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-12 px-8 font-bold shadow-lg"
          >
            <Edit2 className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Main Identity Area */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-950 text-white font-black text-2xl shadow-xl border dark:border-slate-800">
                  {initials}
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">{profile.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Authorized System Account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {editing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Legal Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-blue-500 dark:focus:ring-blue-400 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                        placeholder="Sayyad Azim"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Phone</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-blue-500 dark:focus:ring-blue-400 font-bold bg-white dark:bg-slate-900 dark:text-slate-100"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <Button type="submit" disabled={saving} className="h-12 flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-lg">
                      {saving ? 'Syncing...' : 'Update Identity'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setFormData({ name: profile.name, phone: profile.phone || '' });
                      }}
                      disabled={saving}
                      className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Authenticated Name</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 transition-colors uppercase">{profile.name}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Credential Email</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-lg truncate group-hover:text-blue-600 transition-colors">{profile.email}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Mobile Line</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 transition-colors">{profile.phone || 'NO LINE PROVIDED'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Account Hierarchy</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 transition-colors uppercase">{profile.role || 'User'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-8 rounded-3xl bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-200/50 dark:shadow-none relative overflow-hidden group border-none">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:scale-110 transition-transform" />
            <div className="relative flex items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Verified Operations</h3>
                <p className="text-sm text-blue-100 dark:text-blue-200 font-medium">Your profile is synchronized with national trading protocols.</p>
              </div>
              <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest shadow-sm">
                System Status <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Status Area */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden text-sm">
            <CardHeader className="p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Account Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white shadow-xl relative overflow-hidden group border dark:border-slate-800">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl" />
                <div className="flex items-center gap-4 relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Partner Since</p>
                    <p className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
                      {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    profile.emailVerified
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30 shadow-emerald-100/50 dark:shadow-none"
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 shadow-amber-100/50 dark:shadow-none"
                  )}>
                    {profile.emailVerified ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">Verification</p>
                    <p className={cn(
                      "text-xs font-black uppercase tracking-tight",
                      profile.emailVerified ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                    )}>{profile.emailVerified ? 'Fully Secured' : 'Action Needed'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-blue-100">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">Primary Zone</p>
                    <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">India Operations</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">Account Level</p>
                    <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Tier 1 Analytics</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link href="/user/settings">
                  <Button variant="ghost" className="w-full justify-between h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 group transition-all">
                    Security Protocols
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
