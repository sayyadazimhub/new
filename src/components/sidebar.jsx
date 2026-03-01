'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  Menu,
  X,
  UserCircle,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Sprout,
  BadgeDollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { href: '/user/products', label: 'Products', icon: Package },
      { href: '/user/stock', label: 'Stock', icon: Boxes },
    ],
  },
  {
    title: 'Contacts',
    items: [
      { href: '/user/providers', label: 'Providers', icon: Truck },
      { href: '/user/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    title: 'Transactions',
    items: [
      { href: '/user/purchases', label: 'Purchases', icon: ShoppingCart },
      { href: '/user/sales', label: 'Sales', icon: BadgeDollarSign },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { href: '/user/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/user/profile', label: 'Profile', icon: UserCircle },
      { href: '/user/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Listen for sidebar toggle from Header
  useEffect(() => {
    const handleToggle = () => setOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--removed-body-scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const linkClass = (href) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
      pathname === href
        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100',
      collapsed && 'lg:justify-center'
    );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[2px] lg:hidden transition-all duration-300 ease-in-out touch-none",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[70] flex flex-col border-r bg-white dark:bg-background transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:z-40',
          collapsed ? 'lg:w-20 w-64' : 'w-64',
          open ? 'translate-x-0 shadow-[20px_0_50px_-10px_rgba(0,0,0,0.3)] lg:shadow-none' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex h-16 items-center border-b px-4 transition-all duration-300",
          collapsed ? "lg:justify-center justify-between" : "justify-between"
        )}>
          <Link href="/user/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
              <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
            </div>
            <div className={cn("transition-opacity duration-300", collapsed ? "lg:hidden" : "block")}>
              <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">ATMS</span>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Premium</p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 min-h-0 overflow-y-auto transition-all duration-300 flex flex-col",
          collapsed ? "gap-6 p-4 lg:gap-2 lg:p-2" : "gap-6 p-4"
        )}>
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className={cn(
                "px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",
                collapsed && "lg:hidden"
              )}>
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={linkClass(item.href)}
                    onClick={() => setOpen(false)}
                    title={(collapsed && typeof window !== 'undefined' && window.innerWidth >= 1024) ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Toggle - Desktop Only */}
        <div className="hidden lg:flex p-4 border-t items-center justify-center bg-slate-50 dark:bg-slate-900/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-9 w-9 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
