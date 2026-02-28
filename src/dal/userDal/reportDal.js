import prisma from '@/lib/prisma';

export const reportDal = {
    async getSales(where) {
        return await prisma.sale.findMany({
            where,
            include: { customer: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getPurchases(where) {
        return await prisma.purchase.findMany({
            where,
            include: { provider: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
