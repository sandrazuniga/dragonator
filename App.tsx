import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import UpcomingShows from './components/UpcomingShows';
import NewReleases from './components/NewReleases';
import NewsPage from './components/NewsPage';
import Store from './components/Store';
import ImageAnalyzer from './components/ImageAnalyzer';
import Contact from './components/Contact';
import Account from './components/Account';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import MerchCheckout from './components/MerchCheckout';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import type { Concert, User, Merch, CartItem } from './types';

type Page = 'home' | 'store' | 'analyzer' | 'contact' | 'checkout' | 'account' | 'merchCheckout' | 'news';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [concertForCheckout, setConcertForCheckout] = useState<Concert | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Effect for theme initialization from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('dragonator_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  // Effect for applying theme changes to the DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('dragonator_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load user from storage
    const savedUser = localStorage.getItem('dragonator_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('dragonator_user');
      }
    }
    // Load cart from storage
    const savedCart = localStorage.getItem('dragonator_cart');
    if (savedCart) {
        try {
            setCart(JSON.parse(savedCart));
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            localStorage.removeItem('dragonator_cart');
        }
    }
  }, []);

  useEffect(() => {
    // Save cart to storage whenever it changes
    localStorage.setItem('dragonator_cart', JSON.stringify(cart));
  }, [cart]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('dragonator_user', JSON.stringify(user));
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dragonator_user');
    setCart([]); // Clear cart on logout
    setCurrentPage('home'); // Redirect to home on logout
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('dragonator_user', JSON.stringify(updatedUser));
  };

  const handleStartCheckout = (concert: Concert) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setConcertForCheckout(concert);
    setCurrentPage('checkout');
  };

  const handleCheckoutFinish = () => {
    setConcertForCheckout(null);
    setCurrentPage('home');
  };
  
  const handleMerchCheckoutFinish = () => {
    setCart([]);
    setCurrentPage('home');
  };

  const handleAddToCart = (item: Merch) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            return prevCart.map(cartItem => 
                cartItem.id === item.id 
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
        }
        return [...prevCart, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const handleUpdateCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
        handleRemoveFromCart(itemId);
        return;
    }
    setCart(prevCart => prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
    ));
  };
  
  const handleCartCheckout = () => {
    if (!currentUser) {
        setAuthModalOpen(true);
        return;
    }
    if (cart.length === 0) return;
    setCartOpen(false);
    setCurrentPage('merchCheckout');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSetCurrentPage = (page: Page) => {
    setSearchQuery(''); // Clear search on page change
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'store':
        return <Store onStartCheckout={handleStartCheckout} onAddToCart={handleAddToCart} searchQuery={searchQuery} />;
      case 'analyzer':
        return <ImageAnalyzer />;
      case 'news':
        return <NewsPage searchQuery={searchQuery} />;
      case 'contact':
        return <Contact />;
      case 'account':
        if (!currentUser) {
            setCurrentPage('home');
            return null;
        }
        return <Account user={currentUser} onUserUpdate={handleUserUpdate} />;
      case 'checkout':
        if (!concertForCheckout || !currentUser) {
          // Fallback to home if no concert/user for checkout
          setCurrentPage('home');
          return null;
        }
        return <Checkout concert={concertForCheckout} user={currentUser} onCheckoutFinish={handleCheckoutFinish} />;
      case 'merchCheckout':
        if (!currentUser || cart.length === 0) {
            setCurrentPage('home');
            return null;
        }
        return <MerchCheckout cartItems={cart} user={currentUser} onCheckoutFinish={handleMerchCheckoutFinish} />;
      case 'home':
      default:
        return (
          <>
            <HeroSlider />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <UpcomingShows onStartCheckout={handleStartCheckout} searchQuery={searchQuery} />
              <NewReleases />
            </div>
          </>
        );
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={handleSetCurrentPage}
        currentUser={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onSearch={handleSearch}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
      />
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleCartCheckout}
      />
    </div>
  );
};

export default App;