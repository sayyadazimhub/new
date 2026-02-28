import prisma from '@/lib/prisma';

export const saleDal = {
    async findMany(userId, skip, take) {
        return await prisma.sale.findMany({
            where: { userId },
            include: { customer: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
    },

    async count(userId) {
        return await prisma.sale.count({ where: { userId } });
    },

    async findById(id) {
        return await prisma.sale.findUnique({
            where: { id },
            include: { customer: true, items: { include: { product: true } } },
        });
    },

    async findByIdSimple(id) {
        return await prisma.sale.findUnique({ where: { id } });
    },

    async findByIdWithItems(id, userId) {
        return await prisma.sale.findFirst({
            where: { id, userId },
            include: { items: true },
        });
    },

    async createSaleWithStock(userId, customerId, totalAmount, paidAmount, dueAmount, totalProfit, lineItems) {
        return await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    customerId,
                    userId,
                    totalAmount,
                    paidAmount,
                    dueAmount,
                    totalProfit,
                    items: {
                        create: lineItems.map((it) => ({
                            productId: it.productId,
                            batchId: it.batchId,
                            quantity: it.quantity,
                            costPrice: it.costPrice,
                            salePrice: it.salePrice,
                            profit: it.profit,
                            userId: userId,
                        })),
                    },
                },
                include: { customer: true, items: { include: { product: true } } },
            });

            for (const it of lineItems) {
                if (it.batchId) {
                    await tx.stockBatch.update({
                        where: { id: it.batchId },
                        data: { quantity: { decrement: it.quantity } },
                    });
                } else {
                    let remainingToDeduct = it.quantity;
                    const batches = await tx.stockBatch.findMany({
                        where: { productId: it.productId, userId, quantity: { gt: 0 } },
                        orderBy: { createdAt: 'asc' },
                    });
                    for (const batch of batches) {
                        if (remainingToDeduct <= 0) break;
                        const deductAmount = Math.min(batch.quantity, remainingToDeduct);
                        await tx.stockBatch.update({
                            where: { id: batch.id },
                            data: { quantity: { decrement: deductAmount } },
                        });
                        remainingToDeduct -= deductAmount;
                    }
                }

                await tx.stockBatch.deleteMany({
                    where: { productId: it.productId, userId, quantity: { lte: 0 } },
                });

                await tx.product.update({
                    where: { id: it.productId, userId },
                    data: { currentStock: { decrement: it.quantity } },
                });
            }
            return sale;
        });
    },

    async update(id, data) {
        return await prisma.sale.update({
            where: { id },
            data,
            include: {
                customer: true,
                items: { include: { product: true } },
            },
        });
    },

    async deleteSaleWithRollback(id, userId) {
        const sale = await this.findByIdWithItems(id, userId);
        if (!sale) throw new Error('Sale not found');

        return await prisma.$transaction(async (tx) => {
            for (const item of sale.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { currentStock: { increment: item.quantity } },
                });

                if (item.batchId) {
                    await tx.stockBatch.update({
                        where: { id: item.batchId },
                        data: { quantity: { increment: item.quantity } },
                    });
                }
            }

            await tx.sale.delete({ where: { id } });
        });
    }
};
