import React, { useState } from 'react';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

// --- Icons ---
const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
);


const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email || !message) return;

      setStatus('sending');
      // Simulación de llamada a API
      setTimeout(() => {
          setStatus('sent');
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
          setTimeout(() => setStatus('idle'), 5000);
      }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <SectionTitle>Contact</SectionTitle>
      <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
        Do you have questions, suggestions, or just want to say hello? Leave us a message! The DRAGONATOR team will get back to you as soon as possible. You can also find us at our base of operations.
      </p>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
            {status === 'sent' ? (
            <div className="text-center bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-md animate-fade-in h-full flex items-center justify-center">
                Thanks for your message! The spirit of rock has received it.
            </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="name" className="sr-only">Your Name</label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    disabled={status === 'sending'}
                    className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red transition"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="email" className="sr-only">Your Email</label>
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    disabled={status === 'sending'}
                    className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red transition"
                    />
                </div>
                </div>
                <div>
                    <label htmlFor="phone" className="sr-only">Your Phone (Optional)</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your Phone (Optional)"
                        disabled={status === 'sending'}
                        className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red transition"
                    />
                </div>
                <div>
                <label htmlFor="message" className="sr-only">Your Message</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    rows={4}
                    required
                    disabled={status === 'sending'}
                    className="w-full bg-gray-100 dark:bg-brand-black border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red transition"
                ></textarea>
                </div>
                <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-brand-red text-white py-3 rounded-md font-bold text-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
            </form>
            )}
        </div>
        
        {/* Producer Info & Map */}
        <div className="bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Base of Operations</h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p className="flex items-start">
              <LocationIcon className="w-6 h-6 mr-3 text-brand-red flex-shrink-0 mt-1" />
              <span>Av. Providencia 1234, Oficina 56,<br/>Providencia, Santiago, Chile</span>
            </p>
            <p className="flex items-center">
              <EmailIcon className="w-6 h-6 mr-3 text-brand-red flex-shrink-0" />
              <a href="mailto:contacto@dragonator.cl" className="hover:text-brand-red transition-colors">contacto@dragonator.cl</a>
            </p>
          </div>
          <div className="mt-6 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.588882585258!2d-70.6133496847952!3d-33.43405798077875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c585c5cd1d2b%3A0x5a392cfff6a1b948!2sAv.%20Providencia%201234%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1662581681534!5m2!1ses-419!2scl" 
                width="100%" 
                height="250" 
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="DRAGONATOR Location"
                className="dark:grayscale dark:invert"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;