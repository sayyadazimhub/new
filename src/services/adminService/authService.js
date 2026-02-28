import { authDal } from '@/dal/adminDal/authDal';
import { comparePassword, hashPassword, generateToken } from '@/lib/auth';

export const authService = {
    async login(email, password) {
        const admin = await authDal.findByEmail(email);
        if (!admin) {
            throw new Error('Invalid credentials');
        }

        if (!admin.is_active) {
            throw new Error('Your admin account has been suspended. Please contact the system owner.');
        }

        const isValid = await comparePassword(password, admin.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = await generateToken({ id: admin.id, email: admin.email, role: 'admin' });

        return {
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
        };
    },

    async register(data) {
        const { email, password, name, phone } = data;

        const existingAdmin = await authDal.findByEmail(email);
        if (existingAdmin) {
            throw new Error('An account with this email already exists');
        }

        const hashedPassword = await hashPassword(password);
        const admin = await authDal.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            role: 'ADMIN',
        });

        const token = await generateToken({ id: admin.id, email: admin.email, role: 'admin' });

        return {
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
        };
    },

    async changePassword(adminId, currentPassword, newPassword) {
        const admin = await authDal.findById(adminId);
        if (!admin) {
            throw new Error('Admin not found');
        }

        const isValid = await comparePassword(currentPassword, admin.password);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await hashPassword(newPassword);
        return await authDal.update(adminId, { password: hashedPassword });
    },
};
