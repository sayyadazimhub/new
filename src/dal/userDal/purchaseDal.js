import prisma from '@/lib/prisma';

export const purchaseDal = {
    async findMany(userId, skip, take) {
        return await prisma.purchase.findMany({
            where: { userId },
            include: { provider: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
    },

    async count(userId) {
        return await prisma.purchase.count({ where: { userId } });
    },

    async findById(id) {
        return await prisma.purchase.findUnique({
            where: { id },
            include: { provider: true, items: { include: { product: true } } },
        });
    },

    async findByIdSimple(id) {
        return await prisma.purchase.findUnique({ where: { id } });
    },

    async findByIdWithItems(id, userId) {
        return await prisma.purchase.findFirst({
            where: { id, userId },
            include: { items: true },
        });
    },

    async createPurchaseWithStock(userId, providerId, totalAmount, paidAmount, dueAmount, lineItems) {
        return await prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    providerId,
                    userId,
                    totalAmount,
                    paidAmount,
                    dueAmount,
                    items: { create: lineItems },
                },
                include: { provider: true, items: { include: { product: true } } },
            });

            for (const it of lineItems) {
                // Update product aggregate stock
                await tx.product.update({
                    where: { id: it.productId, userId },
                    data: {
                        currentStock: { increment: it.quantity },
                        baseCostPrice: it.unitPrice,
                    },
                });

                // Manage StockBatch
                const existingBatch = await tx.stockBatch.findFirst({
                    where: {
                        productId: it.productId,
                        userId,
                        purchasePrice: it.unitPrice,
                    },
                });

                if (existingBatch) {
                    await tx.stockBatch.update({
                        where: { id: existingBatch.id },
                        data: { quantity: { increment: it.quantity } },
                    });
                } else {
                    await tx.stockBatch.create({
                        data: {
                            productId: it.productId,
                            userId,
                            purchasePrice: it.unitPrice,
                            quantity: it.quantity,
                        },
                    });
                }
            }
            return purchase;
        });
    },

    async update(id, data) {
        return await prisma.purchase.update({
            where: { id },
            data,
            include: {
                provider: true,
                items: { include: { product: true } },
            },
        });
    },

    async deletePurchaseWithRollback(id, userId) {
        const purchase = await this.findByIdWithItems(id, userId);
        if (!purchase) throw new Error('Purchase not found');

        return await prisma.$transaction(async (tx) => {
            for (const item of purchase.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { currentStock: { decrement: item.quantity } },
                });

                const matchingBatch = await tx.stockBatch.findFirst({
                    where: {
                        productId: item.productId,
                        userId,
                        purchasePrice: item.unitPrice,
                    },
                });

                if (matchingBatch) {
                    await tx.stockBatch.update({
                        where: { id: matchingBatch.id },
                        data: { quantity: { decrement: item.quantity } },
                    });
                }
            }

            await tx.purchase.delete({ where: { id } });
        });
    }
};
