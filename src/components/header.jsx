'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Bell, Activity, Menu, LogOut, Settings, ChevronDown, Sprout, TrendingUp, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    axios.get('/api/user/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error("Header profile fetch error:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/user/auth/logout');
      toast.success('Logged out successfully');
      router.push('/user/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Mobile: Menu Toggle & Branding | Desktop: Search/Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-10 w-10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Desktop Title or Breadcrumb could go here if needed in future */}
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest shadow-sm dark:shadow-none">
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950" />
          </button> */}

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 hover:text-slate-600 transition-colors h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 outline-none">
                {mounted && (
                  <>
                    {theme === 'light' && <Sun className="h-5 w-5" />}
                    {theme === 'dark' && <Moon className="h-5 w-5" />}
                    {theme === 'system' && <Monitor className="h-5 w-5" />}
                  </>
                )}
                {!mounted && <Sun className="h-5 w-5" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 mt-2 rounded-2xl shadow-xl border-slate-100 dark:border-slate-800 p-1.5 overflow-hidden bg-white dark:bg-background">
              <DropdownMenuItem onClick={() => setTheme('light')} className="rounded-xl cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors py-2 px-3 group flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="rounded-xl cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors py-2 px-3 group flex items-center gap-2">
                <Moon className="h-4 w-4 text-blue-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="rounded-xl cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors py-2 px-3 group flex items-center gap-2">
                <Monitor className="h-4 w-4 text-slate-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800 group outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-none uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {profile?.name || 'Trader'}
                  </p>
                  <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">
                    Authorized
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-950 text-white shadow-lg ring-2 ring-white dark:ring-slate-800 relative border dark:border-slate-800">
                  <User className="h-4 w-4" />
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-[1.5rem] shadow-xl border-slate-100 dark:border-slate-800 p-2 overflow-hidden bg-white dark:bg-background">
              <DropdownMenuLabel className="px-3 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">{profile?.name || 'Trader'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate uppercase tracking-widest">{profile?.email || 'Authorized User'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-1 bg-slate-50 dark:bg-slate-800" />
              <DropdownMenuItem
                onClick={() => router.push('/user/profile')}
                className="rounded-xl cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors py-2.5 px-3 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/user/settings')}
                className="rounded-xl cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors py-2.5 px-3 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mr-3 group-hover:bg-slate-900 dark:group-hover:bg-slate-700 group-hover:text-white transition-all">
                  <Settings className="h-4 w-4 text-inherit" />
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1 bg-slate-50 dark:bg-slate-800" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-xl cursor-pointer focus:bg-rose-50 text-rose-600 font-black py-2.5 px-3 group mt-1"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 mr-3 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="text-xs uppercase tracking-widest">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
