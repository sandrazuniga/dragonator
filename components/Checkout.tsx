import React, { useState, useEffect } from 'react';
import type { Concert, CheckoutOrder, User } from '../types';

const CHECKOUT_STORAGE_KEY = 'dragonator_checkout_order';

interface CheckoutProps {
  concert: Concert;
  user: User;
  onCheckoutFinish: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-2 text-center">{children}</h2>
);

const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
    const steps = ['Tickets', 'Information', 'Payment', 'Confirmation'];
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


const Checkout: React.FC<CheckoutProps> = ({ concert, user, onCheckoutFinish }) => {
    const [step, setStep] = useState(1);
    const [order, setOrder] = useState<CheckoutOrder | null>(null);

    useEffect(() => {
        try {
            const savedOrderJSON = localStorage.getItem(CHECKOUT_STORAGE_KEY);
            if (savedOrderJSON) {
                const savedOrder: CheckoutOrder = JSON.parse(savedOrderJSON);
                if (savedOrder.concert.id === concert.id) {
                    if (!savedOrder.userDetails) {
                        savedOrder.userDetails = user;
                    }
                    setOrder(savedOrder);
                } else {
                    initializeOrder();
                }
            } else {
                initializeOrder();
            }
        } catch (error) {
            console.error("Failed to load or parse checkout order from localStorage", error);
            initializeOrder();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [concert, user]);
    
    const initializeOrder = () => {
        const initialSection = concert.sections?.[0]?.name || 'General';
        const initialPrice = concert.ticketPrice * (concert.sections?.[0]?.priceModifier || 1);
        const newOrder: CheckoutOrder = {
            concert,
            ticketDetails: {
                section: initialSection,
                quantity: 1,
                unitPrice: initialPrice,
                totalPrice: initialPrice
            },
            userDetails: user,
        };
        setOrder(newOrder);
    };

    useEffect(() => {
        if (order) {
            localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(order));
        }
    }, [order]);
    
    const updateOrder = (updates: Partial<CheckoutOrder> | ((prev: CheckoutOrder) => Partial<CheckoutOrder>)) => {
        setOrder(prev => {
            if (!prev) return null;
            const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...newUpdates };
        });
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);
    
    const handleFinish = () => {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        onCheckoutFinish();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setUTCHours(12);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (!order) {
        return <div className="text-center py-20">Loading...</div>;
    }

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 concert={concert} order={order} setOrder={setOrder} onNext={handleNext} />;
            case 2: return <Step2 order={order} updateOrder={updateOrder} onNext={handleNext} onBack={handleBack} />;
            case 3: return <Step3 order={order} onNext={handleNext} onBack={handleBack} />;
            case 4: return <Step4 order={order} onFinish={handleFinish} />;
            default:
                setStep(1);
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <SectionTitle>{concert.bandName} in {concert.venue}</SectionTitle>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">{formatDate(concert.date)}</p>
            <ProgressBar step={step} />
            <div className="max-w-3xl mx-auto bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
                {renderStep()}
            </div>
        </div>
    );
};

const Step1: React.FC<{ concert: Concert, order: CheckoutOrder, setOrder: React.Dispatch<React.SetStateAction<CheckoutOrder | null>>, onNext: () => void }> = ({ concert, order, setOrder, onNext }) => {
    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sectionName = e.target.value;
        const section = concert.sections?.find(s => s.name === sectionName);
        if (!section) return;

        const newUnitPrice = concert.ticketPrice * section.priceModifier;
        setOrder(prev => prev && ({
            ...prev,
            ticketDetails: {
                ...prev.ticketDetails,
                section: sectionName,
                unitPrice: newUnitPrice,
                totalPrice: newUnitPrice * prev.ticketDetails.quantity
            }
        }));
    };

    const handleQuantityChange = (delta: number) => {
        setOrder(prev => {
            if (!prev) return null;
            const newQuantity = Math.max(1, Math.min(10, prev.ticketDetails.quantity + delta));
            return {
                ...prev,
                ticketDetails: {
                    ...prev.ticketDetails,
                    quantity: newQuantity,
                    totalPrice: prev.ticketDetails.unitPrice * newQuantity
                }
            };
        });
    };
    
    return (
        <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Select Your Tickets</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Section</label>
                    <select id="section" value={order.ticketDetails.section} onChange={handleSectionChange} className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red">
                        {concert.sections?.map(s => <option key={s.name} value={s.name}>{s.name} - ${Math.round(concert.ticketPrice * s.priceModifier).toLocaleString('es-CL')}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Quantity</label>
                    <div className="flex items-center">
                        <button onClick={() => handleQuantityChange(-1)} className="bg-gray-100 dark:bg-brand-black px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600">-</button>
                        <input type="text" readOnly value={order.ticketDetails.quantity} className="w-16 text-center bg-gray-100 dark:bg-brand-black border-y border-gray-300 dark:border-gray-600 py-2" />
                        <button onClick={() => handleQuantityChange(1)} className="bg-gray-100 dark:bg-brand-black px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600">+</button>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-4 text-right">
                <p className="text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-3xl font-black text-brand-red">${order.ticketDetails.totalPrice.toLocaleString('es-CL')}</p>
            </div>
            <div className="mt-8 flex justify-end">
                <button onClick={onNext} className="bg-brand-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">Next</button>
            </div>
        </div>
    );
};

const Step2: React.FC<{ order: CheckoutOrder, updateOrder: (updates: Partial<CheckoutOrder>) => void, onNext: () => void, onBack: () => void }> = ({ order, updateOrder, onNext, onBack }) => {
    const [name, setName] = useState(order.userDetails?.name || '');
    const [email, setEmail] = useState(order.userDetails?.email || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateOrder({ userDetails: { name, email } });
        onNext();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Buyer Information</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-brand-red focus:border-brand-red" />
                </div>
            </div>
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onBack} className="bg-gray-600 text-white px-8 py-3 rounded-md font-bold hover:bg-gray-500 transition-colors">Back</button>
                <button type="submit" className="bg-brand-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">Next</button>
            </div>
        </form>
    );
};

const Step3: React.FC<{ order: CheckoutOrder, onNext: () => void, onBack: () => void }> = ({ order, onNext, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');

    return (
        <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. Payment (Simulated)</h3>
             <div className="bg-gray-100 dark:bg-brand-black p-4 rounded-md mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white">Order Summary</h4>
                <p className="text-gray-600 dark:text-gray-300">{order.ticketDetails.quantity} x {order.concert.bandName} ({order.ticketDetails.section})</p>
                <p className="text-lg font-bold text-brand-red mt-2">Total: ${order.ticketDetails.totalPrice.toLocaleString('es-CL')}</p>
            </div>
            
            <div className="flex mb-6 border-b-2 border-gray-200 dark:border-brand-gray">
                <button onClick={() => setPaymentMethod('credit-card')} className={`flex-1 py-2 font-bold text-lg transition-colors ${paymentMethod === 'credit-card' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-800 dark:text-white'}`}>Credit Card</button>
                <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-2 font-bold text-lg transition-colors ${paymentMethod === 'paypal' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-800 dark:text-white'}`}>PayPal</button>
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

const Step4: React.FC<{ order: CheckoutOrder, onFinish: () => void }> = ({ order, onFinish }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setUTCHours(12);
        const options: Intl.DateTimeFormatOptions = { dateStyle: 'full' };
        return date.toLocaleDateString('en-US', options);
    };
    return (
        <div className="text-center">
            <h3 className="text-2xl font-bold text-green-500 mb-4">Purchase Successful!</h3>
            <p className="text-gray-800 dark:text-white mb-6">
                We have sent the confirmation and your tickets to <span className="font-bold">{order.userDetails?.email}</span>.
            </p>
             <div className="bg-gray-100 dark:bg-brand-black p-6 rounded-md mb-6 text-left">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-200 dark:border-gray-600 pb-2 mb-4">Your Purchase Details</h4>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-900 dark:text-white">Event:</span> {order.concert.bandName}</p>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-900 dark:text-white">Venue:</span> {order.concert.venue}</p>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-900 dark:text-white">Date:</span> {formatDate(order.concert.date)}</p>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-900 dark:text-white">Tickets:</span> {order.ticketDetails.quantity} x {order.ticketDetails.section}</p>
                <p className="text-lg font-bold text-brand-red mt-4">Total Paid: ${order.ticketDetails.totalPrice.toLocaleString('es-CL')}</p>
            </div>
            <button onClick={onFinish} className="bg-brand-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">Back to Home</button>
        </div>
    );
};


export default Checkout;