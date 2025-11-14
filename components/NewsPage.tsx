import React, { useState } from 'react';
import { getTextToSpeechAudio } from '../services/geminiService';
import { playAudio } from '../utils/audio';
import type { NewsArticle } from '../types';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
);

const RANDOM_NEWS: NewsArticle[] = [
    {
        title: "ONE OK ROCK Anuncia Gira Latinoamericana para 2025",
        summary: "La aclamada banda japonesa ONE OK ROCK ha confirmado que volverán a Latinoamérica en 2025 con su nueva gira mundial. ¡Fuentes cercanas indican que Chile será una de las paradas obligatorias!",
        url: "#",
        source: "DRAGONATOR Music",
        image: "https://spaces.rocksound.tv/uploads/2022/08/one-ok-rock-2018.jpg"
    },
    {
        title: "BAND-MAID Lanza Nuevo Sencillo 'Shambles'",
        summary: "Las maids del rock, BAND-MAID, sorprenden a sus fans con el lanzamiento de su nuevo y potente sencillo 'Shambles'. El video musical ya acumula millones de visitas y los fans chilenos piden a gritos un concierto.",
        url: "#",
        source: "J-Rock News",
        image: "https://ponycanyon.us/wp-content/uploads/2024/02/bandmaid_M.jpg"
    },
    {
        title: "The GazettE Celebra 20 Años con Álbum Compilatorio",
        summary: "Celebrando dos décadas de música, The GazettE ha anunciado un álbum de grandes éxitos que recorrerá toda su carrera. Se rumorea que podría venir acompañado de un show especial en Sudamérica.",
        url: "#",
        source: "Visual Kei Magazine",
        image: "https://jpurecords.com/cdn/shop/collections/the_GazettE_Collection.jpg?v=1645031949"
    },
    {
        title: "Entrevista Exclusiva: El Futuro de la Escena J-Rock en Chile",
        summary: "Hablamos con expertos de la industria sobre el creciente interés por el rock japonés en Chile. ¿Qué bandas podríamos ver en los próximos años? Entérate de todos los detalles en nuestro reportaje.",
        url: "#",
        source: "Chilean Rock Times",
        image: "https://i.ytimg.com/vi/fjDru4RhcrQ/maxresdefault.jpg"
    },
    {
        title: "NEMOPHILA Confirma su Primera Visita a Santiago",
        summary: "La banda de metal femenino NEMOPHILA ha incluido a Santiago en su primera gira mundial. La cita será en el Teatro Caupolicán el próximo mes de mayo. ¡Las entradas ya están a la venta!",
        url: "#",
        source: "Metal Hammer Chile",
        image: "https://jpurecords.com/cdn/shop/articles/nemophila-band_af8bbe51-de3f-4f18-bf47-0c04b0ed92bd.jpg?v=1752623241&width=1080"
    },
    {
        title: "El Fenómeno Babymetal: ¿Regresarán a Chile?",
        summary: "Tras su exitoso paso por el país hace unos años, los fans se preguntan si Babymetal volverá a pisar suelo chileno con su nueva formación. Los rumores son cada vez más fuertes.",
        url: "#",
        source: "Pop & Rock Weekly",
        image: "https://s1.abcstatics.com/media/cultura/2019/12/04/babymetal-kZpG--1248x698@abc.jpg"
    }
];

interface NewsPageProps {
    searchQuery?: string;
}

const NewsPage: React.FC<NewsPageProps> = ({ searchQuery }) => {
  const [news] = useState<NewsArticle[]>(RANDOM_NEWS);
  const [speakingArticle, setSpeakingArticle] = useState<number | null>(null);

  const handleSpeak = async (article: NewsArticle, index: number) => {
    if (speakingArticle === index) return;
    setSpeakingArticle(index);
    const audioContent = await getTextToSpeechAudio(`${article.title}. ${article.summary}`);
    if (audioContent) {
      await playAudio(audioContent);
    }
    setSpeakingArticle(null);
  };

  const filteredNews = news.filter(article =>
    !searchQuery ||
    article.title.toLowerCase().includes(searchQuery) ||
    article.summary.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <SectionTitle>Latest News</SectionTitle>
      {filteredNews.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No news found for your search.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((article, index) => (
            <div key={index} className="bg-white dark:bg-brand-gray rounded-lg shadow-lg flex flex-col animate-slide-in-up overflow-hidden">
                {article.image && (
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex-grow">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{article.summary}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-brand-black">
                        {article.url && article.url !== '#' ? (
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline text-xs font-semibold">
                                Read more...
                            </a>
                        ) :  <span className="text-xs text-gray-500">{article.source}</span>}
                        <button 
                            onClick={() => handleSpeak(article, index)} 
                            className="text-gray-800 dark:text-white hover:text-brand-red transition-colors disabled:opacity-50 disabled:cursor-wait"
                            disabled={speakingArticle === index}
                            title="Read aloud"
                        >
                            <SpeakerIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;