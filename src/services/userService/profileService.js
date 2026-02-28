import { profileDal } from '@/dal/userDal/profileDal';

export const profileService = {
    async getProfile(userId) {
        const user = await profileDal.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async updateProfile(userId, data) {
        const { name, phone } = data;
        if (!name || name.trim().length === 0) {
            throw new Error('Name is required');
        }
        return await profileDal.update(userId, {
            name: name.trim(),
            phone: phone?.trim() || null,
        });
    },
};
