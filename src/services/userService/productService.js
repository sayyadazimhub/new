import { productDal } from '@/dal/userDal/productDal';

export const productService = {
    async getProducts(userId, search = '', page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
        };

        const [products, total] = await Promise.all([
            productDal.findMany(where, skip, limit),
            productDal.count(where)
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    async getProductById(id) {
        const product = await productDal.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    },

    async createProduct(userId, data) {
        const { name, unit, baseCostPrice } = data;
        if (!name || !unit || baseCostPrice === undefined || baseCostPrice === null) {
            throw new Error('Name, unit and base cost price are required');
        }

        const cost = parseFloat(baseCostPrice);
        if (isNaN(cost)) throw new Error('Invalid base cost price');

        return await productDal.create({
            name,
            unit,
            currentStock: 0,
            baseCostPrice: cost,
            userId
        });
    },

    async updateProduct(id, data) {
        const { name, unit, baseCostPrice } = data;
        let updateData = {};
        if (name != null) updateData.name = name;
        if (unit != null) updateData.unit = unit;

        if (baseCostPrice !== undefined && baseCostPrice !== null) {
            const cost = parseFloat(baseCostPrice);
            if (isNaN(cost)) throw new Error('Invalid base cost price');
            updateData.baseCostPrice = cost;
        }

        return await productDal.update(id, updateData);
    },

    async deleteProduct(id) {
        return await productDal.delete(id);
    }
};
