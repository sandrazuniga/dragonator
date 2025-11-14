import React, { useState } from 'react';
import { MERCH, CONCERTS } from '../constants';
import type { Concert, Merch } from '../types';
import ShareModal from './ShareModal';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
);


interface StoreProps {
  onStartCheckout: (concert: Concert) => void;
  onAddToCart: (item: Merch) => void;
  searchQuery?: string;
}

const Store: React.FC<StoreProps> = ({ onStartCheckout, onAddToCart, searchQuery }) => {
    const [activeTab, setActiveTab] = useState<'merch' | 'tickets'>('merch');
    const [itemToShare, setItemToShare] = useState<{ type: 'merch' | 'concert', data: Merch | Concert } | null>(null);
    
    const filteredMerch = MERCH.filter(item =>
        !searchQuery ||
        item.itemName.toLowerCase().includes(searchQuery) ||
        item.bandName.toLowerCase().includes(searchQuery)
    );

    const filteredConcerts = CONCERTS.filter(concert =>
        !searchQuery ||
        concert.bandName.toLowerCase().includes(searchQuery) ||
        concert.venue.toLowerCase().includes(searchQuery) ||
        concert.city.toLowerCase().includes(searchQuery)
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Add time to date to avoid timezone issues
        date.setUTCHours(12);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getShareTitle = (item: { type: 'merch' | 'concert', data: Merch | Concert }): string => {
        if (item.type === 'merch') {
            const merchItem = item.data as Merch;
            return `Check out this awesome ${merchItem.itemName} from ${merchItem.bandName} on DRAGONATOR! #JRockMerch`;
        } else {
            const concertItem = item.data as Concert;
            return `Can't wait for the ${concertItem.bandName} concert at ${concertItem.venue}! Get your tickets at DRAGONATOR. #JRockInChile`;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SectionTitle>Official Store</SectionTitle>

            <div className="flex justify-center mb-8 border-b-2 border-gray-200 dark:border-brand-gray">
                <button
                    onClick={() => setActiveTab('merch')}
                    className={`px-6 py-2 font-bold text-lg transition-colors ${activeTab === 'merch' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-600 dark:text-white'}`}
                >
                    Merchandise
                </button>
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-6 py-2 font-bold text-lg transition-colors ${activeTab === 'tickets' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-600 dark:text-white'}`}
                >
                    Tickets
                </button>
            </div>

            {activeTab === 'merch' && (
                filteredMerch.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {filteredMerch.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-brand-gray rounded-lg overflow-hidden shadow-lg group relative">
                                <button 
                                    onClick={() => setItemToShare({ type: 'merch', data: item })}
                                    className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-full hover:bg-brand-red transition-colors duration-200 z-10"
                                    aria-label="Share merchandise"
                                >
                                    <ShareIcon className="w-4 h-4" />
                                </button>
                                <img src={item.image} alt={item.itemName} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{item.itemName}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.bandName}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xl font-black text-brand-red">${item.price.toLocaleString('es-CL')}</span>
                                        <button 
                                            onClick={() => onAddToCart(item)}
                                            className="bg-brand-red text-white text-sm px-4 py-1 rounded-md font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No merchandise found for your search.</p>
                )
            )}
            
            {activeTab === 'tickets' && (
                filteredConcerts.length > 0 ? (
                    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
                        {filteredConcerts.map((concert) => (
                            <div key={concert.id} className="bg-white dark:bg-brand-gray p-4 md:p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
                                <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{concert.bandName}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{concert.venue}, {concert.city}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(concert.date)}</p>
                                </div>
                                <div className="flex items-center space-x-2 md:space-x-4">
                                    <span className="text-xl font-black text-brand-red">${concert.ticketPrice.toLocaleString('es-CL')}</span>
                                     <button
                                        onClick={() => setItemToShare({ type: 'concert', data: concert })}
                                        className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-brand-gray transition-colors duration-300"
                                        aria-label="Share concert ticket"
                                    >
                                        <ShareIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onStartCheckout(concert)} className="bg-brand-red text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors">
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No tickets found for your search.</p>
                 )
            )}

            {itemToShare && (
                <ShareModal
                    isOpen={!!itemToShare}
                    onClose={() => setItemToShare(null)}
                    title={getShareTitle(itemToShare)}
                    shareUrl={window.location.href}
                />
            )}
        </div>
    );
};

export default Store;