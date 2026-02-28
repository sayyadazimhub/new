import { customerDal } from '@/dal/userDal/customerDal';

export const customerService = {
    async getCustomers(userId, search = '', page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { phone: { contains: search } }] } : {})
        };

        const [customers, total] = await Promise.all([
            customerDal.findMany(where, skip, limit),
            customerDal.count(where)
        ]);

        return {
            customers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    async getCustomerById(id) {
        const customer = await customerDal.findByIdWithSales(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    },

    async createCustomer(userId, data) {
        const { name, phone, address } = data;
        if (!name) {
            throw new Error('Name is required');
        }
        return await customerDal.create({
            name,
            phone: phone || null,
            address: address || null,
            userId
        });
    },

    async updateCustomer(id, data) {
        const { name, phone, address } = data;
        return await customerDal.update(id, {
            ...(name != null && { name }),
            ...(phone != null && { phone }),
            ...(address != null && { address }),
        });
    },

    async deleteCustomer(id) {
        return await customerDal.delete(id);
    }
};
