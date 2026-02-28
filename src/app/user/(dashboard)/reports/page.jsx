'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Printer,
  TrendingUp,
  ShoppingBag,
  PieChart,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCcw,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [type, setType] = useState('today');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for type in URL search params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam && ['today', 'weekly', 'daily', 'monthly', 'yearly'].includes(typeParam)) {
        setType(typeParam);
      }
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [type]);

  const fetchReport = () => {
    setLoading(true);
    fetch(`/api/user/reports?type=${type}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Failed to load report:', err))
      .finally(() => setLoading(false));
  };

  const handlePrint = () => {
    if (!data) return;

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Business Report - ${type.toUpperCase()}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          @media print {
            @page { margin: 15mm; }
            body { -webkit-print-color-adjust: exact; }
          }
          body { 
            font-family: 'Inter', sans-serif; 
            color: #0f172a;
            line-height: 1.4;
            padding: 0;
            margin: 0;
          }
          .report-header { 
            border-bottom: 4px solid #0f172a; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand h1 { 
            font-size: 36px; 
            font-weight: 900; 
            margin: 0; 
            letter-spacing: -1px; 
            text-transform: uppercase;
          }
          .brand p { 
            margin: 2px 0 0 0; 
            font-weight: 700; 
            color: #64748b; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            font-size: 10px;
          }
          .meta-info { text-align: right; }
          .meta-label { 
            font-size: 9px; 
            font-weight: 900; 
            color: #94a3b8; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          .meta-value { font-size: 14px; font-weight: 900; font-style: italic; }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card {
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .summary-label {
            font-size: 10px;
            font-weight: 900;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .summary-value {
            font-size: 20px;
            font-weight: 900;
          }

          .section-title {
            font-size: 12px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #f8fafc;
            padding: 8px 12px;
            border-left: 4px solid #0f172a;
            margin-bottom: 12px;
            margin-top: 24px;
          }

          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
          th { 
            text-align: left; 
            font-size: 9px; 
            font-weight: 900; 
            text-transform: uppercase; 
            padding: 10px;
            background: #f8fafc;
            border-bottom: 2px solid #0f172a;
            color: #64748b;
          }
          td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 11px; vertical-align: top; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .items-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          .item-tag {
            font-size: 9px;
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
          }
          
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 9px; 
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="brand">
            <h1>Market Statement</h1>
            <p>Agriculture Trading Management System</p>
          </div>
          <div class="meta-info">
            <div class="meta-label">Audit Period</div>
            <div class="meta-value">
              ${new Date(data.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} — 
              ${new Date(data.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card" style="background: #f0fdf4;">
            <div class="summary-label" style="color: #166534;">Total Sales</div>
            <div class="summary-value" style="color: #15803d;">₹${Number(data.totalSales || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card" style="background: #eff6ff;">
            <div class="summary-label" style="color: #1e40af;">Total Purchases</div>
            <div class="summary-value" style="color: #1d4ed8;">₹${Number(data.totalPurchases || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card" style="background: ${data.totalProfit >= 0 ? '#ecfdf5' : '#fef2f2'};">
            <div class="summary-label" style="color: ${data.totalProfit >= 0 ? '#065f46' : '#991b1b'};">${data.totalProfit >= 0 ? 'Net Profit' : 'Net Loss'}</div>
            <div class="summary-value" style="color: ${data.totalProfit >= 0 ? '#047857' : '#b91c1c'};">${data.totalProfit >= 0 ? '+' : '-'}₹${Math.abs(data.totalProfit || 0).toLocaleString('en-IN')}</div>
            <div style="font-size: 9px; font-weight: 700; color: ${data.totalProfit >= 0 ? '#059669' : '#dc2626'}; margin-top: 4px;">Margin: ${data.totalSales > 0 ? ((data.totalProfit / data.totalSales) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>

        <div class="section-title">Detailed Sales Analytics</div>
        <table>
          <thead>
            <tr>
              <th style="width: 15%">Date</th>
              <th style="width: 20%">Customer</th>
              <th style="width: 35%">Commodity Details</th>
              <th style="width: 15%" class="text-right">Total</th>
              <th style="width: 15%" class="text-right">Profit / Loss</th>
            </tr>
          </thead>
          <tbody>
            ${data.sales?.map(sale => `
              <tr>
                <td>${new Date(sale.createdAt).toLocaleDateString('en-IN')}</td>
                <td class="font-bold">${sale.customer?.name || 'Walk-in'}</td>
                <td>
                  <div class="items-list">
                    ${sale.items.map(item => `<span class="item-tag">${item.product.name} (${item.quantity})</span>`).join('')}
                  </div>
                </td>
                <td class="text-right font-bold" style="color: #15803d;">₹${sale.totalAmount.toLocaleString('en-IN')}</td>
                <td class="text-right font-bold" style="color: ${sale.totalProfit >= 0 ? '#047857' : '#b91c1c'};">${sale.totalProfit >= 0 ? '+' : '-'}₹${Math.abs(sale.totalProfit).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Detailed Procurement Analytics</div>
        <table>
          <thead>
            <tr>
              <th style="width: 15%">Date</th>
              <th style="width: 20%">Provider</th>
              <th style="width: 35%">Acquisition Details</th>
              <th style="width: 15%" class="text-right">Outlay</th>
              <th style="width: 15%" class="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${data.purchases?.map(p => `
              <tr>
                <td>${new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                <td class="font-bold">${p.provider?.name || 'Unknown'}</td>
                <td>
                  <div class="items-list">
                    ${p.items.map(item => `<span class="item-tag">${item.product.name} (${item.quantity})</span>`).join('')}
                  </div>
                </td>
                <td class="text-right font-bold" style="color: #1d4ed8;">₹${p.totalAmount.toLocaleString('en-IN')}</td>
                <td class="text-right font-bold" style="color: #b91c1c;">₹${p.dueAmount.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential Business Intelligence • Generated by ATMS • No Signature Required</p>
        </div>
      </body>
      </html>
    `;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Print and cleanup
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto print:p-0">
      {/* Premium Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-slate-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-3xl font-black tracking-tight">Business Analytics</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2 font-medium">
            <PieChart className="h-4 w-4" />
            Data-driven insights into your procurement and liquidations
          </p>
        </div>
        <Button
          onClick={handlePrint}
          className="relative bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-12 px-6 font-bold shadow-lg"
        >
          <Printer className="mr-2 h-5 w-5" />
          Export PDF Report
        </Button>
      </div>

      {/* Control Panel - Simple Responsive Flex */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 print:hidden">
        <div className="w-full sm:w-64">
          <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">Analytical Window</Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full h-10 rounded-lg dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
                <SelectValue placeholder="Select window" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                <SelectItem value="today">Today's Activity</SelectItem>
                <SelectItem value="weekly">Last 7 Days</SelectItem>
                <SelectItem value="daily">Trailing 30 Days</SelectItem>
                <SelectItem value="monthly">Current Month Cycle</SelectItem>
                <SelectItem value="yearly">Fiscal Year Overview</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={fetchReport}
          disabled={loading}
          className="h-10 w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {loading ? (
            <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Re-Sync Data
        </Button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block border-b-4 border-slate-900 pb-8 mb-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Market Statement</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-sm">Agriculture Trading Management System</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 mb-1">AUDIT PERIOD</p>
            <p className="text-lg font-black text-slate-900 italic">
              {data ? `${new Date(data.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} — ${new Date(data.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}` : '...'}
            </p>
          </div>
        </div>
      </div>
      <CardContent>
        {loading && !data ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : data ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground dark:text-slate-400">
              <p>Period: {new Date(data.startDate).toLocaleDateString('en-IN')} - {new Date(data.endDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-green-50/50 dark:bg-emerald-950/20 border-green-100 dark:border-emerald-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-green-600 dark:text-emerald-400">Total Sales</p>
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-green-700 dark:text-emerald-300">
                    ₹{Number(data.totalSales || 0).toLocaleString('en-IN')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Purchases</p>
                    <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ₹{Number(data.totalPurchases || 0).toLocaleString('en-IN')}
                  </p>
                </CardContent>
              </Card>

              <Card className={cn(
                "border shadow-sm",
                data.totalProfit >= 0
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30"
                  : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30"
              )}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm font-medium",
                      data.totalProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {data.totalProfit >= 0 ? "Net Profit" : "Net Loss"}
                    </p>
                    <PieChart className={cn(
                      "h-4 w-4",
                      data.totalProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={cn(
                      "mt-2 text-2xl font-bold",
                      data.totalProfit >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
                    )}>
                      {data.totalProfit >= 0 ? '+' : '-'}₹{Math.abs(data.totalProfit || 0).toLocaleString('en-IN')}
                    </p>
                    <span className={cn(
                      "text-[10px] font-black tracking-widest",
                      data.totalProfit >= 0 ? "text-emerald-600/60" : "text-rose-600/60"
                    )}>
                      ({data.totalSales > 0 ? ((data.totalProfit / data.totalSales) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50 dark:bg-slate-900/50 border-muted dark:border-slate-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">Transactions</p>
                    <Info className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold dark:text-slate-100">
                    {(data.sales?.length || 0) + (data.purchases?.length || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 space-y-8">
              {/* Detailed Sales Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                    Sales Details
                  </h3>
                </div>
                <div className="rounded-lg border dark:border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-sm">
                      <thead className="bg-muted/50 dark:bg-slate-900">
                        <tr>
                          <th className="p-3 text-left dark:text-slate-400">Date</th>
                          <th className="p-3 text-left dark:text-slate-400">Customer</th>
                          <th className="p-3 text-left dark:text-slate-400">Items</th>
                          <th className="p-3 text-right dark:text-slate-400">Amount</th>
                          <th className="p-3 text-right dark:text-slate-400">Profit / Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.sales?.map(sale => (
                          <tr key={sale.id} className="border-t dark:border-slate-800 hover:bg-muted/20 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 text-muted-foreground dark:text-slate-500">
                              {new Date(sale.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="p-3 font-semibold dark:text-slate-200">
                              {sale.customer?.name || 'Walk-in'}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {sale.items.map(item => (
                                  <span key={item.id} className="text-[10px] bg-muted dark:bg-slate-900 px-1.5 py-0.5 rounded ring-1 ring-inset ring-muted-foreground/10 dark:ring-slate-800 dark:text-slate-300">
                                    {item.product.name} ({item.quantity})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-right font-bold text-green-600 dark:text-emerald-500">
                              ₹{sale.totalAmount.toLocaleString()}
                            </td>
                            <td className={cn(
                              "p-3 text-right font-bold",
                              sale.totalProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            )}>
                              {sale.totalProfit >= 0 ? '+' : '-'}₹{Math.abs(sale.totalProfit).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Detailed Purchases Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ArrowDownRight className="h-5 w-5 text-blue-600" />
                    Purchase Details
                  </h3>
                </div>
                <div className="rounded-lg border dark:border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-sm">
                      <thead className="bg-muted/50 dark:bg-slate-900">
                        <tr>
                          <th className="p-3 text-left dark:text-slate-400">Date</th>
                          <th className="p-3 text-left dark:text-slate-400">Provider</th>
                          <th className="p-3 text-left dark:text-slate-400">Items</th>
                          <th className="p-3 text-right dark:text-slate-400">Amount</th>
                          <th className="p-3 text-right dark:text-slate-400">Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.purchases?.map(p => (
                          <tr key={p.id} className="border-t dark:border-slate-800 hover:bg-muted/20 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 text-muted-foreground dark:text-slate-500">
                              {new Date(p.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="p-3 font-semibold dark:text-slate-200">
                              {p.provider?.name || 'Unknown'}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {p.items.map(item => (
                                  <span key={item.id} className="text-[10px] bg-muted dark:bg-slate-900 px-1.5 py-0.5 rounded ring-1 ring-inset ring-muted-foreground/10 dark:ring-slate-800 dark:text-slate-300">
                                    {item.product.name} ({item.quantity})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                              ₹{p.totalAmount.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-medium text-destructive dark:text-rose-400">
                              ₹{p.dueAmount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </div>
  );
}
