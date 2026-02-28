import { saleDal } from '@/dal/userDal/saleDal';
import prisma from '@/lib/prisma';

export const saleService = {
    async getSales(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [sales, total] = await Promise.all([
            saleDal.findMany(userId, skip, limit),
            saleDal.count(userId)
        ]);

        return {
            sales,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
        };
    },

    async getSaleById(id) {
        const sale = await saleDal.findById(id);
        if (!sale) throw new Error('Sale not found');
        return sale;
    },

    async createSale(userId, data) {
        const { customerId, items, paidAmount = 0 } = data;
        if (!customerId || !Array.isArray(items) || items.length === 0) {
            throw new Error('Customer and at least one item are required');
        }

        let totalAmount = 0;
        let totalProfit = 0;
        const lineItems = [];

        for (const it of items) {
            const product = await prisma.product.findUnique({
                where: { id: it.productId, userId }
            });
            if (!product) throw new Error(`Product ${it.productId} not found`);

            const qty = parseFloat(it.quantity) || 0;
            let costPrice = parseFloat(it.costPrice) || 0;

            if (it.batchId) {
                const batch = await prisma.stockBatch.findUnique({
                    where: { id: it.batchId, userId }
                });
                if (!batch) throw new Error(`Batch ${it.batchId} not found`);
                if (batch.quantity < qty) {
                    throw new Error(`Insufficient stock in selected batch. Available: ${batch.quantity}`);
                }
                costPrice = batch.purchasePrice;
            } else {
                if (product.currentStock < qty) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.currentStock}`);
                }
            }

            const salePrice = parseFloat(it.salePrice) || 0;
            const profit = (salePrice - costPrice) * qty;
            totalAmount += salePrice * qty;
            totalProfit += profit;

            lineItems.push({
                productId: it.productId,
                batchId: it.batchId,
                quantity: qty,
                costPrice,
                salePrice,
                profit,
            });
        }

        const paid = parseFloat(paidAmount) || 0;
        const dueAmount = totalAmount - paid;

        return await saleDal.createSaleWithStock(
            userId,
            customerId,
            totalAmount,
            paid,
            dueAmount,
            totalProfit,
            lineItems
        );
    },

    async updatePayment(id, paidAmount) {
        if (paidAmount === undefined) throw new Error('paidAmount is required');

        const sale = await saleDal.findByIdSimple(id);
        if (!sale) throw new Error('Sale not found');

        const paid = parseFloat(paidAmount) || 0;
        const dueAmount = sale.totalAmount - paid;

        return await saleDal.update(id, {
            paidAmount: paid,
            dueAmount,
        });
    },

    async deleteSale(id, userId) {
        return await saleDal.deleteSaleWithRollback(id, userId);
    }
};
