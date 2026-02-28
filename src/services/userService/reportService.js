import { reportDal } from '@/dal/userDal/reportDal';

export const reportService = {
    async getUserReports(userId, options = {}) {
        const { type = 'today', start, end } = options;
        let startDate;
        let endDate;

        if (start && end) {
            startDate = new Date(start);
            endDate = new Date(end);
        } else {
            endDate = new Date();
            if (type === 'yearly') {
                startDate = new Date(endDate.getFullYear(), 0, 1);
            } else if (type === 'monthly') {
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            } else if (type === 'today') {
                startDate = new Date(endDate);
                startDate.setHours(0, 0, 0, 0);
            } else if (type === 'weekly') {
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 7);
            } else {
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 30);
            }
        }

        const where = { userId, createdAt: { gte: startDate, lte: endDate } };

        const [sales, purchases] = await Promise.all([
            reportDal.getSales(where),
            reportDal.getPurchases(where)
        ]);

        const totalSales = sales.reduce((s, i) => s + i.totalAmount, 0);
        const totalProfit = sales.reduce((s, i) => s + i.totalProfit, 0);
        const totalPurchases = purchases.reduce((s, i) => s + i.totalAmount, 0);

        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            type,
            totalSales,
            totalPurchases,
            totalProfit,
            netProfit: totalProfit,
            sales,
            purchases,
        };
    }
};
