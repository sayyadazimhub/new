import prisma from '@/lib/prisma';

export const authDal = {
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    },

    async findById(id) {
        return await prisma.user.findUnique({ where: { id } });
    },

    async create(data) {
        return await prisma.user.create({ data });
    },

    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data,
        });
    },

    async findByEmailAndOtp(email, otp) {
        return await prisma.user.findFirst({
            where: {
                email,
                otp,
                otpExpiresAt: { gt: new Date() },
            },
        });
    },
};
