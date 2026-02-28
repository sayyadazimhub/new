import prisma from '@/lib/prisma';

export const reportDal = {
    async getOverallStats(where) {
        return await prisma.sale.aggregate({
            where,
            _sum: { totalAmount: true, totalProfit: true },
            _count: { id: true }
        });
    },

    async getTraderPerformance(where, take = 5) {
        return await prisma.sale.groupBy({
            by: ['userId'],
            where,
            _sum: { totalAmount: true, totalProfit: true },
            orderBy: { _sum: { totalAmount: 'desc' } },
            take
        });
    },

    async getRecentSalesForTimeline(since) {
        return await prisma.sale.findMany({
            where: {
                createdAt: { gte: since },
                userId: { not: null }
            },
            select: { createdAt: true, totalAmount: true, totalProfit: true },
            orderBy: { createdAt: 'asc' }
        });
    },

    async getTradersByIds(ids) {
        return await prisma.user.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true }
        });
    },

    async getItemStats(where, take = 4) {
        return await prisma.saleItem.groupBy({
            by: ['productId'],
            where,
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take
        });
    },

    async getProductsByIds(ids) {
        return await prisma.product.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true }
        });
    },

    async getTraderCount() {
        return await prisma.user.count({ where: { role: 'USER' } });
    },

    async getProductCount() {
        return await prisma.product.count();
    }
};
