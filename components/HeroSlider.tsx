import React, { useState, useEffect } from 'react';
import { BANDS } from '../constants';

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      {BANDS.map((band, index) => (
        <div
          key={band.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={band.image} alt={band.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/70 to-transparent dark:from-brand-black dark:via-brand-black/70"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-16 animate-fade-in">
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
              {band.name}
            </h1>
            <p className="text-lg md:text-2xl text-brand-red font-bold mt-2">
              {band.genre}
            </p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {BANDS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-brand-red' : 'bg-gray-800/80 dark:bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;