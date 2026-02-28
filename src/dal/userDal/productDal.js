import prisma from '@/lib/prisma';

export const productDal = {
    async findMany(where, skip, take) {
        return await prisma.product.findMany({
            where,
            include: {
                batches: {
                    where: { quantity: { gt: 0 } },
                    orderBy: { createdAt: 'asc' }
                },
                purchaseItems: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { unitPrice: true }
                }
            },
            orderBy: { name: 'asc' },
            skip,
            take,
        });
    },

    async count(where) {
        return await prisma.product.count({ where });
    },

    async findById(id) {
        return await prisma.product.findUnique({
            where: { id },
        });
    },

    async create(data) {
        return await prisma.product.create({ data });
    },

    async update(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
        });
    },

    async delete(id) {
        return await prisma.product.delete({ where: { id } });
    }
};
