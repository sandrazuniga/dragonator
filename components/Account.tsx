import React, { useState } from 'react';
import type { User } from '../types';

interface AccountProps {
    user: User;
    onUserUpdate: (updatedUser: User) => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

const Account: React.FC<AccountProps> = ({ user, onUserUpdate }) => {
    const [billingDetails, setBillingDetails] = useState(user.billing || {
        address: '',
        city: '',
        country: '',
        phone: '',
    });
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingDetails({
            ...billingDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        const updatedUser = { ...user, billing: billingDetails };
        
        // Simulate API call
        setTimeout(() => {
            onUserUpdate(updatedUser);
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <SectionTitle>My Account</SectionTitle>
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">
                {/* Personal Details Section */}
                <div className="bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-brand-red/50 pb-2">Personal Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                        <p className="text-lg text-gray-900 dark:text-white font-semibold">{user.name}</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="text-lg text-gray-900 dark:text-white font-semibold">{user.email}</p>
                    </div>
                </div>

                {/* Billing Details Section */}
                <div className="bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-brand-red/50 pb-2">Billing Details</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Address</label>
                            <input type="text" id="address" name="address" value={billingDetails.address} onChange={handleChange} className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                         <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">City</label>
                            <input type="text" id="city" name="city" value={billingDetails.city} onChange={handleChange} className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                         <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Country</label>
                            <input type="text" id="country" name="country" value={billingDetails.country} onChange={handleChange} className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Phone</label>
                            <input type="tel" id="phone" name="phone" value={billingDetails.phone} onChange={handleChange} className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'saving'}
                            className="w-full mt-4 bg-brand-red text-white py-3 rounded-md font-bold text-lg disabled:bg-gray-500 hover:bg-red-700 transition-colors"
                        >
                            {status === 'saving' ? 'Saving...' : (status === 'saved' ? 'Saved!' : 'Save Changes')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;