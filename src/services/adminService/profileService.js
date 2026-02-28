import { profileDal } from '@/dal/adminDal/profileDal';

export const profileService = {
    async getProfile(adminId) {
        const admin = await profileDal.findById(adminId);
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin;
    },

    async updateProfile(adminId, data) {
        const { name, phone, email } = data;
        return await profileDal.update(adminId, {
            name,
            phone,
            email,
        });
    },
};
