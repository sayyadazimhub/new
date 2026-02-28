import prisma from '@/lib/prisma';

export const authDal = {
    async findByEmail(email) {
        return await prisma.admin.findUnique({ where: { email } });
    },

    async findById(id) {
        return await prisma.admin.findUnique({ where: { id } });
    },

    async create(data) {
        return await prisma.admin.create({ data });
    },

    async update(id, data) {
        return await prisma.admin.update({
            where: { id },
            data,
        });
    },

    async findFirstActiveWithResetToken(token) {
        return await prisma.admin.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
                is_active: true,
            },
        });
    },
};
