export const settingsService = {
    async getSettings(userId) {
        // Current requirement: return hardcoded default settings
        return {
            theme: 'light',
            notifications: {
                email: true,
                lowStock: true,
                newSale: false,
                newPurchase: false,
            },
            preferences: {
                currency: 'INR',
                dateFormat: 'DD/MM/YYYY',
                lowStockThreshold: 10,
            },
        };
    },

    async updateSettings(userId, body) {
        // Current requirement: return updated settings (not persisted yet)
        return {
            theme: body.theme || 'light',
            notifications: body.notifications || {
                email: true,
                lowStock: true,
                newSale: false,
                newPurchase: false,
            },
            preferences: body.preferences || {
                currency: 'INR',
                dateFormat: 'DD/MM/YYYY',
                lowStockThreshold: 10,
            },
        };
    }
};
