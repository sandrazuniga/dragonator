import React from 'react';
import type { CartItem } from '../types';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveItem: (itemId: number) => void;
    onUpdateQuantity: (itemId: number, quantity: number) => void;
    onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }) => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-brand-gray shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b-2 border-brand-red/50">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Your Cart</h2>
                        <button onClick={onClose} className="text-gray-800 dark:text-white text-3xl hover:text-brand-red">&times;</button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                                <p className="text-lg">Your cart is empty.</p>
                                <p className="text-sm">Add some merch to show your rock spirit!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-start space-x-4 bg-gray-100 dark:bg-brand-black p-2 rounded-lg">
                                        <img src={item.image} alt={item.itemName} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{item.itemName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.bandName}</p>
                                            <p className="text-brand-red font-semibold">${item.price.toLocaleString('es-CL')}</p>
                                            <div className="flex items-center mt-2">
                                                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 dark:bg-brand-black px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md text-gray-900 dark:text-white">-</button>
                                                <span className="bg-gray-200 dark:bg-brand-black px-4 py-1 border-y border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">{item.quantity}</span>
                                                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 dark:bg-brand-black px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-900 dark:text-white">+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.id)} className="text-gray-500 hover:text-red-500 text-xl font-bold">&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-4 border-t-2 border-brand-red/50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">Subtotal:</span>
                                <span className="text-2xl font-black text-brand-red">${subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            <button 
                                onClick={onCheckout}
                                className="w-full bg-brand-red text-white py-3 rounded-md font-bold text-lg hover:bg-red-700 transition-colors"
                            >
                                Proceed to Checkout (Simulated)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;