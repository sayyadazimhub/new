'use client';

import Link from 'next/link';
import { Package, TrendingUp, BarChart3, Users, Truck, ShoppingCart, ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      desc: 'Track stock levels with automatic updates and low-stock alerts',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Sales & Purchases',
      desc: 'Record transactions with profit calculation and payment tracking',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      desc: 'Comprehensive insights with daily, monthly, and yearly analytics',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: Users,
      title: 'Customer Management',
      desc: 'Manage customers with transaction history and due tracking',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Truck,
      title: 'Supplier Management',
      desc: 'Track providers and suppliers with purchase records',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      icon: ShoppingCart,
      title: 'Transaction History',
      desc: 'Complete audit trail of all sales and purchase activities',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const benefits = [
    'Real-time inventory tracking',
    'Automated profit calculations',
    'Payment & due management',
    'Comprehensive reporting',
    'Multi-user support',
    'Mobile responsive design',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header - Kept Premium as requested */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-950 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
              <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">ATMS</span>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mt-1">Premium</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/user/login">
              <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                Sign In
              </Button>
            </Link>
            <Link href="/user/register">
              <Button className="h-10 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-6 font-bold uppercase tracking-widest text-xs shadow-md">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Simplified Hero Section */}
      <section className="py-20 sm:py-32 border-b bg-slate-50/30 dark:bg-slate-900/10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-background px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 mb-8 uppercase tracking-widest">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Agricultural Trading Made Simple
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
              Professional Tools for
              <span className="block text-emerald-600 dark:text-emerald-400">Trading Success</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Complete management system for agricultural trading. Track inventory, manage sales, and generate reports in one clean platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/user/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 px-8 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white w-full">
                  Start Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/user/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl text-sm font-bold uppercase tracking-widest border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((item) => (
              <div
                key={item.title}
                className="group border-b border-slate-100 dark:border-slate-800 pb-8 sm:border-0 sm:pb-0"
              >
                <div className={`inline-flex p-3 rounded-xl ${item.color.replace('bg-', 'dark:bg-opacity-20 bg-').replace('text-', 'dark:text- opacity-100 text-')} mb-4 bg-opacity-50`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section (Original, but with dark mode classes) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
                  Built for Modern Trading
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  ATMS provides all the tools you need to run your agricultural trading business efficiently and profitably.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/user/register">
                    <Button size="lg" className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white">
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <span className="font-medium text-slate-900">Stock Value</span>
                      <span className="text-lg font-bold text-blue-600">₹2,45,000</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <span className="font-medium text-slate-900">Gross Profit</span>
                      <span className="text-lg font-bold text-emerald-600">₹45,230</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-violet-50 border border-violet-200">
                      <span className="font-medium text-slate-900">Receivables</span>
                      <span className="text-lg font-bold text-violet-600">₹12,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Join hundreds of traders who are already using ATMS to streamline their operations
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/user/register">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-slate-900 hover:bg-slate-100 w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 mt-10">
              <p className="text-sm text-center text-slate-600">
                © 2026 ATMS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
