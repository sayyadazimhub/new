import { authDal } from '@/dal/userDal/authDal';
import { comparePassword, hashPassword, signUserToken } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mail';
import crypto from 'crypto';

function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

export const authService = {
    async login(email, password) {
        const user = await authDal.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.emailVerified) {
            throw new Error('Please verify your email first. Check your inbox for the OTP.');
        }

        if (!user.is_active) {
            throw new Error('Your account has been suspended. Please contact the administrator.');
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = await signUserToken({ id: user.id, email: user.email, role: 'user' });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    },

    async register(data) {
        const { email, password, name, phone } = data;

        const existingUser = await authDal.findByEmail(email);
        if (existingUser) {
            throw new Error('An account with this email already exists');
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        const user = await authDal.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            otp,
            otpExpiresAt,
            role: 'USER',
        });

        await sendOtpEmail(email, otp, 'verification');

        return user;
    },

    async verifyOtp(email, otp) {
        const user = await authDal.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or OTP');
        }

        if (user.emailVerified) {
            throw new Error('Email already verified. You can log in.');
        }

        if (user.otp !== otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
            throw new Error('Invalid or expired OTP');
        }

        const updatedUser = await authDal.update(user.id, {
            emailVerified: true,
            otp: null,
            otpExpiresAt: null,
        });

        const token = await signUserToken({ id: updatedUser.id, email: updatedUser.email, role: 'user' });

        return {
            token,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            },
        };
    },
};
