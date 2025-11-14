import React, { useState } from 'react';
import type { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const savedUser = localStorage.getItem('dragonator_user');
        if (savedUser) {
            try {
                const user: User = JSON.parse(savedUser);
                if (user.email === email) {
                    onLoginSuccess(user);
                } else {
                    setError('Incorrect credentials. Please try again.');
                }
            } catch {
                setError('Could not verify user.');
            }
        } else {
            setError('No user registered with that email.');
        }
    };
    
    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }
        const newUser: User = { name, email };
        onLoginSuccess(newUser);
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-brand-gray rounded-lg p-8 max-w-md w-full mx-4 animate-slide-in-up relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-800 dark:text-white text-3xl hover:text-brand-red">&times;</button>
                
                <div className="flex mb-6 border-b-2 border-gray-200 dark:border-brand-gray">
                    <button
                        onClick={() => { setActiveTab('login'); resetForm(); }}
                        className={`flex-1 py-2 font-bold text-lg transition-colors ${activeTab === 'login' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-800 dark:text-white'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => { setActiveTab('signup'); resetForm(); }}
                        className={`flex-1 py-2 font-bold text-lg transition-colors ${activeTab === 'signup' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-800 dark:text-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome Back</h3>
                        <div>
                            <label htmlFor="login-email" className="sr-only">Email</label>
                            <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red"/>
                        </div>
                        <div>
                            <label htmlFor="login-password" className="sr-only">Password</label>
                            <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red"/>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-md font-bold text-lg hover:bg-red-700 transition-colors">
                            Enter
                        </button>
                    </form>
                )}

                {activeTab === 'signup' && (
                     <form onSubmit={handleSignup} className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Join the Invasion</h3>
                        <div>
                            <label htmlFor="signup-name" className="sr-only">Your Name</label>
                            <input type="text" id="signup-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red"/>
                        </div>
                        <div>
                            <label htmlFor="signup-email" className="sr-only">Email</label>
                            <input type="email" id="signup-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red"/>
                        </div>
                        <div>
                            <label htmlFor="signup-password" className="sr-only">Create a Password</label>
                            <input type="password" id="signup-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a Password" required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red"/>
                        </div>
                         {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-md font-bold text-lg hover:bg-red-700 transition-colors">
                            Create Account
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;