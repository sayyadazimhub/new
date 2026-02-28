import prisma from '@/lib/prisma';

export const profileDal = {
    async findById(id) {
        return await prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                is_active: true,
                createdAt: true,
            },
        });
    },

    async update(id, data) {
        return await prisma.admin.update({
            where: { id },
            data,
        });
    },
};
