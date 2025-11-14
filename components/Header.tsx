import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { BANDS, CONCERTS, MERCH, NEW_RELEASES } from '../constants';

type Page = 'home' | 'store' | 'analyzer' | 'contact' | 'checkout' | 'account' | 'merchCheckout' | 'news';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  cartItemCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const NavLink: React.FC<{
  page: 'home' | 'store' | 'analyzer' | 'contact' | 'news';
  currentPage: string;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => (
  <button
    onClick={() => setCurrentPage(page)}
    className={`px-4 py-2 text-sm md:text-base font-bold transition-colors duration-300 ${
      currentPage === page
        ? 'text-brand-red scale-110'
        : 'text-gray-800 dark:text-white hover:text-brand-red'
    }`}
  >
    {children}
  </button>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.64 5.64zm12.72 12.72c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zM5.64 18.36l1.06-1.06c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0zm12.72-12.72l1.06-1.06c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0z"/>
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.64-.11 2.41-.31-1.1-1.04-1.74-2.45-1.74-4.02 0-3.09 2.61-5.61 5.7-5.61.94 0 1.81.23 2.59.63C19.78 6.02 16.14 3 12 3z"/>
    </svg>
);

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, currentUser, onLoginClick, onLogoutClick, cartItemCount, onCartClick, onSearch, theme, onThemeToggle }) => {
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSearchQuery('');
  }, [currentPage]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('dragonator_recent_searches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error("Failed to parse recent searches from localStorage", e);
      }
    }
  }, []);
  
  const handleSearchSubmit = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const updatedSearches = [
      trimmedQuery, 
      ...recentSearches.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('dragonator_recent_searches', JSON.stringify(updatedSearches));

    onSearch(trimmedQuery);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
        const lowerCaseQuery = query.toLowerCase();
        const newSuggestions = new Set<string>();

        const searchCorpus: string[] = [
            ...BANDS.map(b => b.name),
            ...CONCERTS.flatMap(c => [c.bandName, c.venue]),
            ...MERCH.flatMap(m => [m.bandName, m.itemName]),
            ...NEW_RELEASES.flatMap(r => [r.bandName, r.releaseTitle]),
        ];

        const uniqueItems = [...new Set(searchCorpus)];
        
        uniqueItems.forEach(item => {
            if (item.toLowerCase().includes(lowerCaseQuery)) {
                newSuggestions.add(item);
            }
        });
        
        setSuggestions(Array.from(newSuggestions).slice(0, 7));
        setShowSuggestions(true);
    } else {
        setSuggestions([]);
        setShowSuggestions(recentSearches.length > 0); 
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit(searchQuery);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    handleSearchSubmit(query);
  };
  
  const dropdownContent = () => {
    const suggestionTextColor = "text-gray-800 dark:text-white";
    const suggestionHoverBg = "hover:bg-brand-red";
    const suggestionHoverText = "dark:hover:text-white hover:text-white";

    if (searchQuery.length > 0 && suggestions.length > 0) {
      return (
        <>
          <span className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Suggestions</span>
          {suggestions.map((suggestion, index) => (
            <button
              key={`sugg-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`block w-full text-left px-4 py-2 text-sm ${suggestionTextColor} ${suggestionHoverBg} ${suggestionHoverText}`}
            >
              {suggestion}
            </button>
          ))}
        </>
      );
    }
    
    if (searchQuery.length === 0 && recentSearches.length > 0) {
      return (
        <>
          <span className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Recent Searches</span>
          {recentSearches.map((search, index) => (
            <button
              key={`rec-${index}`}
              onClick={() => handleSuggestionClick(search)}
              className={`block w-full text-left px-4 py-2 text-sm ${suggestionTextColor} ${suggestionHoverBg} ${suggestionHoverText}`}
            >
              {search}
            </button>
          ))}
        </>
      );
    }
    return null;
  };

  const content = dropdownContent();

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md z-50 shadow-lg dark:shadow-brand-red/10">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <img 
          src="https://images.seeklogo.com/logo-png/28/2/dragon-logo-png_seeklogo-280364.png" 
          alt="Dragonator Logo" 
          className="h-12 w-auto cursor-pointer dark:invert"
          onClick={() => setCurrentPage('home')}
        />
        <div className="flex items-center space-x-2 md:space-x-4">
          <NavLink page="home" currentPage={currentPage} setCurrentPage={setCurrentPage}>Home</NavLink>
          <NavLink page="store" currentPage={currentPage} setCurrentPage={setCurrentPage}>Store</NavLink>
          <NavLink page="analyzer" currentPage={currentPage} setCurrentPage={setCurrentPage}>Fan Zone</NavLink>
          <NavLink page="news" currentPage={currentPage} setCurrentPage={setCurrentPage}>News</NavLink>
          <NavLink page="contact" currentPage={currentPage} setCurrentPage={setCurrentPage}>Contact</NavLink>
          
          <div 
            className="relative hidden md:block"
            onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setShowSuggestions(false);
                }
            }}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="w-40 bg-gray-200 dark:bg-brand-gray border border-gray-300 dark:border-gray-600 rounded-full py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all duration-300 focus:w-56"
            />
            {showSuggestions && content && (
              <div className="absolute top-full mt-2 w-56 bg-white dark:bg-brand-gray rounded-md shadow-lg py-1 z-50 animate-fade-in">
                {content}
              </div>
            )}
          </div>

          <button
                onClick={onThemeToggle}
                className="text-gray-800 dark:text-white hover:text-brand-red transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>

           <button 
                onClick={onCartClick}
                className="relative text-gray-800 dark:text-white hover:text-brand-red transition-colors"
                aria-label="Shopping cart"
            >
                <CartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
           </button>

           <div className="relative">
            <button 
                onClick={currentUser ? () => setUserDropdownOpen(!isUserDropdownOpen) : onLoginClick}
                className="text-gray-800 dark:text-white hover:text-brand-red transition-colors"
                aria-label="User account"
            >
                <UserIcon className="w-6 h-6" />
            </button>
            {currentUser && isUserDropdownOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-gray rounded-md shadow-lg py-1 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                >
                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                        Hi, <span className="font-bold text-gray-900 dark:text-white">{currentUser.name}</span>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentPage('account');
                            setUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-brand-red hover:text-white"
                    >
                        My Account
                    </button>
                    <button
                        onClick={() => {
                            onLogoutClick();
                            setUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-brand-red hover:text-white"
                    >
                        Log Out
                    </button>
                </div>
            )}
           </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;