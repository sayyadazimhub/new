import prisma from '@/lib/prisma';

export const providerDal = {
    async findMany(where, skip, take) {
        return await prisma.provider.findMany({
            where,
            orderBy: { name: 'asc' },
            skip,
            take,
        });
    },

    async count(where) {
        return await prisma.provider.count({ where });
    },

    async findByIdWithPurchases(id) {
        return await prisma.provider.findUnique({
            where: { id },
            include: {
                purchases: {
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
    },

    async create(data) {
        return await prisma.provider.create({ data });
    },

    async update(id, data) {
        return await prisma.provider.update({
            where: { id },
            data,
        });
    },

    async delete(id) {
        return await prisma.provider.delete({ where: { id } });
    }
};
