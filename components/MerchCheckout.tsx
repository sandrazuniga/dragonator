import React, { useState, useEffect } from 'react';
import type { CartItem, User, MerchOrder } from '../types';

interface MerchCheckoutProps {
  cartItems: CartItem[];
  user: User;
  onCheckoutFinish: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-2 text-center">{children}</h2>
);

const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
    const steps = ['Shipping', 'Payment', 'Confirmation'];
    return (
        <div className="flex justify-center items-center my-8">
            {steps.map((name, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index + 1 <= step ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-brand-gray text-gray-500 dark:text-gray-400'}`}>
                            {index + 1}
                        </div>
                        <p className={`mt-2 text-sm text-center ${index + 1 <= step ? 'text-gray-800 dark:text-white' : 'text-gray-500'}`}>{name}</p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${index + 1 < step ? 'bg-brand-red' : 'bg-gray-200 dark:bg-brand-gray'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


const MerchCheckout: React.FC<MerchCheckoutProps> = ({ cartItems, user, onCheckoutFinish }) => {
    const [step, setStep] = useState(1);
    const [order, setOrder] = useState<MerchOrder | null>(null);

    useEffect(() => {
        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setOrder({
            cartItems: cartItems,
            shippingDetails: {
                name: user.name,
                email: user.email,
                address: user.billing?.address || '',
                city: user.billing?.city || '',
                country: user.billing?.country || '',
                phone: user.billing?.phone || ''
            },
            subtotal: subtotal
        });
    }, [cartItems, user]);
    
    const updateOrder = (updates: Partial<MerchOrder>) => {
        setOrder(prev => {
            if (!prev) return null;
            return { ...prev, ...updates };
        });
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);
    
    if (!order) {
        return <div className="text-center py-20">Loading...</div>;
    }

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 order={order} updateOrder={updateOrder} onNext={handleNext} />;
            case 2: return <Step2 order={order} onNext={handleNext} onBack={handleBack} />;
            case 3: return <Step3 order={order} onFinish={onCheckoutFinish} />;
            default:
                setStep(1);
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <SectionTitle>Merchandise Checkout</SectionTitle>
            <ProgressBar step={step} />
            <div className="max-w-3xl mx-auto bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
                {renderStep()}
            </div>
        </div>
    );
};

const Step1: React.FC<{ order: MerchOrder, updateOrder: (updates: Partial<MerchOrder>) => void, onNext: () => void }> = ({ order, updateOrder, onNext }) => {
    const [shipping, setShipping] = useState(order.shippingDetails);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateOrder({ shippingDetails: shipping });
        onNext();
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Order Summary</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {order.cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-300">{item.itemName} (x{item.quantity})</span>
                            <span className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-black text-brand-red">${order.subtotal.toLocaleString('es-CL')}</span>
                </div>
            </div>
            {/* Shipping Form */}
            <form onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shipping Information</h3>
                <div className="space-y-3">
                    <input type="text" name="name" value={shipping.name} onChange={handleChange} placeholder="Full Name" required className="w-full bg-gray-100 dark:bg-brand-black p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    <input type="email" name="email" value={shipping.email} onChange={handleChange} placeholder="Email" required className="w-full bg-gray-100 dark:bg-brand-black p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    <input type="text" name="address" value={shipping.address} onChange={handleChange} placeholder="Address" required className="w-full bg-gray-100 dark:bg-brand-black p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    <input type="text" name="city" value={shipping.city} onChange={handleChange} placeholder="City" required className="w-full bg-gray-100 dark:bg-brand-black p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    <input type="text" name="country" value={shipping.country} onChange={handleChange} placeholder="Country" required className="w-full bg-gray-100 dark:bg-brand-black p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    <input type="tel" name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone" required className="w-full bg-gray-100 dark:bg-brand-black p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                </div>
                 <div className="mt-6 flex justify-end">
                    <button type="submit" className="bg-brand-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">Next</button>
                </div>
            </form>
        </div>
    );
};


const Step2: React.FC<{ order: MerchOrder, onNext: () => void, onBack: () => void }> = ({ order, onNext, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');

    return (
        <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Payment (Simulated)</h3>
             <div className="bg-gray-100 dark:bg-brand-black p-4 rounded-md mb-6">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-900 dark:text-white">Your Order Summary</h4>
                    <p className="text-lg font-bold text-brand-red">Total: ${order.subtotal.toLocaleString('es-CL')}</p>
                </div>
            </div>
            
            <div className="flex mb-6 border-b-2 border-gray-200 dark:border-brand-gray">
                <button
                    onClick={() => setPaymentMethod('credit-card')}
                    className={`flex-1 py-2 font-bold text-lg transition-colors ${paymentMethod === 'credit-card' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-800 dark:text-white'}`}
                >
                    Credit Card
                </button>
                <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 py-2 font-bold text-lg transition-colors ${paymentMethod === 'paypal' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-800 dark:text-white'}`}
                >
                    PayPal
                </button>
            </div>

            {paymentMethod === 'credit-card' && (
                <div className="space-y-4 animate-fade-in">
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Card Number</label>
                        <input type="text" placeholder="**** **** **** 1234" className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Expiration (MM/YY)</label>
                            <input type="text" placeholder="12/28" className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                         <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">CVC</label>
                            <input type="text" placeholder="123" className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div className="text-center p-8 bg-gray-100 dark:bg-brand-black rounded-md animate-fade-in">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">You will be redirected to PayPal to complete your payment securely.</p>
                </div>
            )}

            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="bg-gray-600 text-white px-8 py-3 rounded-md font-bold hover:bg-gray-500 transition-colors">Back</button>
                <button onClick={onNext} className="bg-brand-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">Confirm Purchase</button>
            </div>
        </div>
    );
};

const Step3: React.FC<{ order: MerchOrder, onFinish: () => void }> = ({ order, onFinish }) => {
    return (
        <div className="text-center">
            <h3 className="text-2xl font-bold text-green-500 mb-4">Thank you for your purchase!</h3>
            <p className="text-gray-800 dark:text-white mb-6">
                 We have received your order and will ship it soon to the provided address. You will receive a confirmation email at <span className="font-bold">{order.shippingDetails.email}</span>.
            </p>
             <div className="bg-gray-100 dark:bg-brand-black p-6 rounded-md mb-6 text-left">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-200 dark:border-gray-600 pb-2 mb-4">Your Order Summary</h4>
                <div className="space-y-2 mb-4">
                     {order.cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-300">{item.itemName} (x{item.quantity})</span>
                            <span className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                        </div>
                    ))}
                </div>
                 <div className="border-t border-gray-200 dark:border-gray-600 pt-2 text-right">
                    <p className="text-lg font-bold text-brand-red">Total Paid: ${order.subtotal.toLocaleString('es-CL')}</p>
                </div>
                <div className="mt-4">
                    <p className="font-semibold text-gray-900 dark:text-white">Shipping to:</p>
                    <p className="text-gray-600 dark:text-gray-300">{order.shippingDetails.name}</p>
                    <p className="text-gray-600 dark:text-gray-300">{order.shippingDetails.address}, {order.shippingDetails.city}</p>
                    <p className="text-gray-600 dark:text-gray-300">{order.shippingDetails.country}</p>
                </div>
            </div>
            <button onClick={onFinish} className="bg-brand-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">Back to Home</button>
        </div>
    );
};


export default MerchCheckout;