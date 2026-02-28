import prisma from '@/lib/prisma';

export const profileDal = {
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
};
