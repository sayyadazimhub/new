import { reportDal } from '@/dal/adminDal/reportDal';

export const reportService = {
    async getAdminReports(range = '30d') {
        const now = new Date();
        let startDate = null;
        if (range === '7d') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (range === '30d') {
            startDate = new Date(now.setDate(now.getDate() - 30));
        } else if (range === '90d') {
            startDate = new Date(now.setDate(now.getDate() - 90));
        }
        if (startDate) startDate.setHours(0, 0, 0, 0);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const whereClause = startDate ? {
            createdAt: { gte: startDate },
            userId: { not: null }
        } : { userId: { not: null } };

        const [overallStats, tradersBaseStats, recentSales, traderCount, productCount] = await Promise.all([
            reportDal.getOverallStats(whereClause),
            reportDal.getTraderPerformance(whereClause),
            reportDal.getRecentSalesForTimeline(sixMonthsAgo),
            reportDal.getTraderCount(),
            reportDal.getProductCount()
        ]);

        // Process Timeline Data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyAggregation = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const mKey = `${monthNames[d.getMonth()]}`;
            monthlyAggregation[mKey] = { month: mKey, revenue: 0, profit: 0, order: 6 - i };
        }

        recentSales.forEach(sale => {
            const mKey = monthNames[new Date(sale.createdAt).getMonth()];
            if (monthlyAggregation[mKey]) {
                monthlyAggregation[mKey].revenue += sale.totalAmount;
                monthlyAggregation[mKey].profit += sale.totalProfit;
            }
        });
        const revenueData = Object.values(monthlyAggregation).sort((a, b) => a.order - b.order);

        // Process Trader Performance
        const userIds = tradersBaseStats.map(s => s.userId).filter(Boolean);
        const tradersList = await reportDal.getTradersByIds(userIds);
        const traderPerformance = tradersBaseStats
            .map(stat => {
                const trader = tradersList.find(u => u.id === stat.userId);
                if (!trader) return null;
                return {
                    name: trader.name,
                    volume: stat._sum.totalAmount || 0,
                    profit: stat._sum.totalProfit || 0
                };
            })
            .filter(Boolean);

        // Process Category Share
        const itemStats = await reportDal.getItemStats({
            userId: { not: null },
            createdAt: startDate ? { gte: startDate } : undefined
        });
        const products = await reportDal.getProductsByIds(itemStats.map(s => s.productId));
        const categoryShare = itemStats.map(stat => ({
            name: products.find(p => p.id === stat.productId)?.name || 'Commodity',
            value: stat._sum.quantity || 0
        }));

        return {
            revenueData,
            traderPerformance: traderPerformance.length > 0 ? traderPerformance : [{ name: 'No Data Yet', volume: 0, profit: 0 }],
            categoryShare: categoryShare.length > 0 ? categoryShare : [{ name: 'No Sales', value: 100 }],
            metrics: {
                totalRevenue: overallStats._sum.totalAmount || 0,
                totalProfit: overallStats._sum.totalProfit || 0,
                traderCount,
                transactionCount: overallStats._count.id
            }
        };
    }
};
