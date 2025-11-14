import React, { useState } from 'react';
import { NEW_RELEASES } from '../constants';
import type { NewRelease } from '../types';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

const Modal: React.FC<{ release: NewRelease | null; onClose: () => void }> = ({ release, onClose }) => {
    if (!release) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-brand-gray rounded-lg p-6 max-w-md w-full mx-4 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-brand-red">{release.releaseTitle}</h3>
                        <p className="text-lg text-gray-900 dark:text-white">{release.bandName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-800 dark:text-white text-2xl leading-none">&times;</button>
                </div>
                <div>
                    <img src={release.coverArt} alt={release.releaseTitle} className="w-full h-auto object-cover rounded-md mb-4" />
                    <iframe
                        style={{borderRadius: "12px"}}
                        src={release.spotifyEmbedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

const NewReleases: React.FC = () => {
    const [selectedRelease, setSelectedRelease] = useState<NewRelease | null>(null);

    return (
        <section className="py-16 md:py-24">
            <SectionTitle>New Releases</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {NEW_RELEASES.map((release) => (
                    <div 
                        key={release.id} 
                        className="bg-white dark:bg-brand-gray rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-brand-red/20"
                        onClick={() => setSelectedRelease(release)}
                    >
                        <img src={release.coverArt} alt={release.releaseTitle} className="w-full h-48 md:h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="text-md font-bold text-gray-900 dark:text-white truncate">{release.releaseTitle}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{release.bandName}</p>
                            <p className="text-xs text-brand-red font-semibold mt-1">{release.releaseType}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Modal release={selectedRelease} onClose={() => setSelectedRelease(null)} />
        </section>
    );
};

export default NewReleases;