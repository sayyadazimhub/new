import prisma from '@/lib/prisma';

export const traderDal = {
    async findMany(where, skip, take) {
        return await prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                is_active: true,
                createdAt: true,
            }
        });
    },

    async count(where) {
        return await prisma.user.count({ where });
    },

    async getTradersSalesStats() {
        return await prisma.sale.groupBy({
            by: ['userId'],
            _sum: { totalAmount: true, totalProfit: true },
            _count: { id: true }
        });
    },

    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data
        });
    },

    async findByIdWithDetails(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                is_active: true,
                createdAt: true,
                role: true,
            }
        });
    },

    async getTraderBusinessStats(id) {
        const [customers, providers, products, salesAggregate] = await Promise.all([
            prisma.customer.count({ where: { userId: id } }),
            prisma.provider.count({ where: { userId: id } }),
            prisma.product.count({ where: { userId: id } }),
            prisma.sale.aggregate({
                where: { userId: id },
                _sum: { totalAmount: true, totalProfit: true },
                _count: { id: true }
            })
        ]);

        return { customers, providers, products, salesAggregate };
    },

    async getRecentSales(id, limit = 5) {
        return await prisma.sale.findMany({
            where: { userId: id },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: { select: { name: true } }
            }
        });
    },

    async deleteTraderCascading(id) {
        // Delete related entities first
        await prisma.saleItem.deleteMany({ where: { userId: id } });
        await prisma.sale.deleteMany({ where: { userId: id } });
        await prisma.purchaseItem.deleteMany({ where: { userId: id } });
        await prisma.purchase.deleteMany({ where: { userId: id } });
        await prisma.customer.deleteMany({ where: { userId: id } });
        await prisma.provider.deleteMany({ where: { userId: id } });
        await prisma.product.deleteMany({ where: { userId: id } });
        // Finally delete user
        return await prisma.user.delete({ where: { id } });
    }
};
