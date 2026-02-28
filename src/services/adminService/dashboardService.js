import { dashboardDal } from '@/dal/adminDal/dashboardDal';

export const dashboardService = {
    async getDashboardData() {
        const [
            [totalTraders, activeTraders, salesAgg, purchasesAgg, salesCount, purchasesCount],
            recentTradersRaw,
            { sales, purchases }
        ] = await Promise.all([
            dashboardDal.getStats(),
            dashboardDal.getRecentTraders(5),
            dashboardDal.getChartData(6)
        ]);

        // Process chart data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = {};

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const mKey = monthNames[d.getMonth()];
            monthlyData[mKey] = { name: mKey, volume: 0 };
        }

        sales.forEach(s => {
            const mKey = monthNames[new Date(s.createdAt).getMonth()];
            if (monthlyData[mKey]) monthlyData[mKey].volume += s.totalAmount;
        });
        purchases.forEach(p => {
            const mKey = monthNames[new Date(p.createdAt).getMonth()];
            if (monthlyData[mKey]) monthlyData[mKey].volume += p.totalAmount;
        });

        return {
            summary: {
                totalTraders,
                activeTraders,
                totalTransactions: salesCount,
                totalVolume: salesAgg._sum.totalAmount || 0,
                totalProfit: salesAgg._sum.totalProfit || 0,
            },
            chartData: Object.values(monthlyData),
            recentTraders: recentTradersRaw.map(t => ({
                ...t,
                joined: t.createdAt
            }))
        };
    }
};
