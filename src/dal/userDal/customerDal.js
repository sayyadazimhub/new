import prisma from '@/lib/prisma';

export const customerDal = {
    async findMany(where, skip, take) {
        return await prisma.customer.findMany({
            where,
            orderBy: { name: 'asc' },
            skip,
            take,
        });
    },

    async count(where) {
        return await prisma.customer.count({ where });
    },

    async findByIdWithSales(id) {
        return await prisma.customer.findUnique({
            where: { id },
            include: {
                sales: {
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
        return await prisma.customer.create({ data });
    },

    async update(id, data) {
        return await prisma.customer.update({
            where: { id },
            data,
        });
    },

    async delete(id) {
        return await prisma.customer.delete({ where: { id } });
    }
};
