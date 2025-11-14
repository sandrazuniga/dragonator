import React, { useState } from 'react';

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1 .5-1 1V12h2.5l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.23 4.15 1.95 6.56 1.95 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
    </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.1c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.41 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42s2.42 3.62 2.42 5.82c-.01 4.54-3.71 8.24-8.25 8.24zm4.52-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.09-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.88 2.4 1 2.56.12.17 1.76 2.68 4.27 3.77 2.5 1.08 2.5.72 2.95.69.45-.03 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.05-.12-.2-.18-.44-.3z"/>
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, shareUrl }) => {
  const [copyStatus, setCopyStatus] = useState('Copy Link');

  if (!isOpen) return null;

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-8 h-8" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon className="w-8 h-8" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#1DA1F2]',
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-8 h-8" />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-[#25D366]',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Link'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed to copy');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-brand-gray rounded-lg p-6 max-w-sm w-full mx-4 animate-slide-in-up relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-800 dark:text-white text-3xl hover:text-brand-red">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-bold text-brand-red mb-6 text-center">Share this!</h3>

        <div className="flex justify-around items-center mb-6">
          {shareOptions.map(option => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-800 dark:text-white transition-colors duration-300 ${option.color}`}
              aria-label={`Share on ${option.name}`}
            >
              {option.icon}
            </a>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-2 pr-24 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-brand-red text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            {copyStatus}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
