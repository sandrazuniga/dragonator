import React, { useState } from 'react';
import { CONCERTS, BANDS } from '../constants';
import type { Band, Concert } from '../types';
import ShareModal from './ShareModal';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
);

const Modal: React.FC<{ band: Band | undefined; onClose: () => void }> = ({ band, onClose }) => {
    if (!band) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-brand-gray rounded-lg p-6 max-w-4xl w-full mx-4 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-bold text-brand-red">{band.name}</h3>
                    <button onClick={onClose} className="text-gray-800 dark:text-white text-2xl">&times;</button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-xl font-bold mb-2">Listen Now</h4>
                         <iframe
                            style={{borderRadius: "12px"}}
                            src={band.spotifyEmbedUrl}
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-2">Watch Video</h4>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${band.youtubeVideoId}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface UpcomingShowsProps {
  onStartCheckout: (concert: Concert) => void;
  searchQuery?: string;
}

const UpcomingShows: React.FC<UpcomingShowsProps> = ({ onStartCheckout, searchQuery }) => {
    const [selectedBand, setSelectedBand] = useState<Band | undefined>(undefined);
    const [concertToShare, setConcertToShare] = useState<Concert | null>(null);
    
    const openModal = (bandId: number) => {
        const band = BANDS.find(b => b.id === bandId);
        setSelectedBand(band);
    };

    const closeModal = () => {
        setSelectedBand(undefined);
    };

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

  return (
    <section className="py-16 md:py-24">
      <SectionTitle>Upcoming Shows in Chile</SectionTitle>
      {filteredConcerts.length > 0 ? (
        <div className="space-y-6">
            {filteredConcerts.map((concert) => (
            <div key={concert.id} className="bg-white dark:bg-brand-gray p-4 md:p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-brand-red/20">
                <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(concert.date)}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{concert.bandName}</h3>
                <p className="text-gray-600 dark:text-gray-300">{concert.venue}, {concert.city}</p>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button onClick={() => openModal(concert.bandId)} className="bg-transparent border-2 border-brand-red text-brand-red px-6 py-2 rounded-md font-bold hover:bg-brand-red hover:text-white transition-colors duration-300">
                        Media
                    </button>
                     <button 
                        onClick={() => setConcertToShare(concert)}
                        className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-brand-gray transition-colors duration-300"
                        aria-label="Share concert"
                    >
                        <ShareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onStartCheckout(concert)} className="bg-brand-red text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors duration-300">
                        Buy Tickets
                    </button>
                </div>
            </div>
            ))}
        </div>
      ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No shows found for your search.</p>
      )}
      {selectedBand && <Modal band={selectedBand} onClose={closeModal} />}
      {concertToShare && (
        <ShareModal
            isOpen={!!concertToShare}
            onClose={() => setConcertToShare(null)}
            title={`Can't wait for the ${concertToShare.bandName} concert at ${concertToShare.venue}! Get your tickets at DRAGONATOR. #JRockInChile #Dragonator`}
            shareUrl={window.location.href}
        />
      )}
    </section>
  );
};

export default UpcomingShows;