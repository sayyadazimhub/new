import prisma from '@/lib/prisma';

export const dashboardDal = {
    async getBaseStats(userId, dateFilter) {
        const filter = { ...dateFilter, userId };
        return await Promise.all([
            prisma.sale.aggregate({
                where: filter,
                _sum: { totalAmount: true, totalProfit: true }
            }),
            prisma.sale.aggregate({ where: { userId }, _sum: { dueAmount: true } }),
            prisma.purchase.aggregate({
                where: filter,
                _sum: { totalAmount: true, paidAmount: true, dueAmount: true }
            }),
            prisma.purchase.aggregate({ where: { userId }, _sum: { dueAmount: true } }),
            prisma.product.findMany({
                where: { userId, currentStock: { lte: 10 } },
                orderBy: { currentStock: 'asc' },
                take: 10,
            })
        ]);
    },

    async getRawTransactions(userId, dateFilter) {
        const filter = { ...dateFilter, userId };
        return await Promise.all([
            prisma.sale.findMany({
                where: filter,
                select: { createdAt: true, totalAmount: true, totalProfit: true },
                orderBy: { createdAt: 'asc' },
            }),
            prisma.purchase.findMany({
                where: filter,
                select: { createdAt: true, totalAmount: true },
                orderBy: { createdAt: 'asc' },
            })
        ]);
    },

    async getSecondaryStats(userId, dateFilter) {
        const filter = { ...dateFilter, userId };
        return await Promise.all([
            prisma.sale.findMany({
                where: filter,
                include: { customer: true, items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            prisma.purchase.findMany({
                where: filter,
                include: { provider: true, items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            prisma.saleItem.groupBy({
                by: ['productId'],
                where: filter,
                _sum: { quantity: true, profit: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),
            prisma.sale.groupBy({
                by: ['customerId'],
                where: filter,
                _sum: { totalAmount: true },
                orderBy: { _sum: { totalAmount: 'desc' } },
                take: 5,
            }),
            prisma.purchase.groupBy({
                by: ['providerId'],
                where: filter,
                _sum: { totalAmount: true },
                orderBy: { _sum: { totalAmount: 'desc' } },
                take: 5,
            }),
        ]);
    },

    async getProductDetails(id) {
        return await prisma.product.findUnique({
            where: { id },
            select: { name: true, unit: true },
        });
    },

    async getCustomerDetails(id) {
        return await prisma.customer.findUnique({
            where: { id },
            select: { name: true },
        });
    },

    async getProviderDetails(id) {
        return await prisma.provider.findUnique({
            where: { id },
            select: { name: true },
        });
    }
};
