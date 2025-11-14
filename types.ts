export interface Band {
  id: number;
  name: string;
  genre: string;
  image: string;
  bio: string;
  spotifyEmbedUrl: string;
  youtubeVideoId: string;
}

export interface ConcertSection {
    name: string;
    priceModifier: number;
}

export interface Concert {
  id: number;
  bandId: number;
  bandName: string;
  date: string;
  venue: string;
  city: string;
  ticketPrice: number;
  sections: ConcertSection[];
}

export interface Merch {
  id: number;
  bandName: string;
  itemName: string;
  price: number;
  image: string;
}

export interface CartItem extends Merch {
    quantity: number;
}

export interface User {
    name: string;
    email: string;
    billing?: {
        address: string;
        city: string;
        country: string;
        phone: string;
    };
}

export interface NewsArticle {
    title: string;
    summary: string;
    url?: string;
    source?: string;
    image?: string;
}

export interface TicketDetails {
    section: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface CheckoutOrder {
    concert: Concert;
    ticketDetails: TicketDetails;
    userDetails: User;
}

export interface MerchOrder {
    cartItems: CartItem[];
    shippingDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
        country: string;
        phone: string;
    };
    subtotal: number;
}

export interface NewRelease {
  id: number;
  bandName: string;
  releaseTitle: string;
  releaseType: 'Album' | 'Single' | 'EP';
  releaseDate: string;
  coverArt: string;
  spotifyEmbedUrl: string;
}
