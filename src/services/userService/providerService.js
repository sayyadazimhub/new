import { providerDal } from '@/dal/userDal/providerDal';

export const providerService = {
    async getProviders(userId, search = '', page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { phone: { contains: search } }] } : {})
        };

        const [providers, total] = await Promise.all([
            providerDal.findMany(where, skip, limit),
            providerDal.count(where)
        ]);

        return {
            providers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    async getProviderById(id) {
        const provider = await providerDal.findByIdWithPurchases(id);
        if (!provider) throw new Error('Provider not found');
        return provider;
    },

    async createProvider(userId, data) {
        const { name, phone, address } = data;
        if (!name) throw new Error('Name is required');
        return await providerDal.create({
            name,
            phone: phone || null,
            address: address || null,
            userId
        });
    },

    async updateProvider(id, data) {
        const { name, phone, address } = data;
        return await providerDal.update(id, {
            ...(name != null && { name }),
            ...(phone != null && { phone }),
            ...(address != null && { address }),
        });
    },

    async deleteProvider(id) {
        return await providerDal.delete(id);
    }
};
