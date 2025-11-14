import type { Band, Concert, Merch, NewRelease } from './types';

export const BANDS: Band[] = [
  {
    id: 1,
    name: 'ONE OK ROCK',
    genre: 'Alternative Rock',
    image: 'https://revulsionmx.com/wp-content/uploads/2025/02/ONE-OK-ROCK_DETOX_REVULSIONMX.jpg',
    bio: 'ONE OK ROCK is a Japanese rock band, formed in Tokyo, Japan in 2005. The band currently consists of Takahiro Moriuchi, Toru Yamashita, Ryota Kohama, and Tomoya Kanki.',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/7k73EtZwoPs516ZxE72KsO?utm_source=generator',
    youtubeVideoId: 'Hh9yZWeTmVM'
  },
  {
    id: 2,
    name: 'BAND-MAID',
    genre: 'Hard Rock',
    image: 'https://cdn.mos.cms.futurecdn.net/5saisKsLuzWkvkvYGgojBD.jpg',
    bio: 'BAND-MAID is a Japanese rock band formed in 2013. The band combines a rock sound with a maid image modeled on Japanese maid cafés.',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/5Wh3G01Xfxn2zzN9o4FtnN?utm_source=generator',
    youtubeVideoId: 'Uds7g3M-4lQ'
  },
  {
    id: 3,
    name: 'the GazettE',
    genre: 'Visual Kei / Metal',
    image: 'https://cdn-images.dzcdn.net/images/artist/46c4afc2734eb5d14f3d8611c43e0910/1900x1900-000000-80-0-0.jpg',
    bio: 'The GazettE is a Japanese visual kei rock band from Kanagawa, formed in early 2002. The band is currently signed to Sony Music Records.',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/2_Gv0q0sLlo2iA35G2a1D5?utm_source=generator',
    youtubeVideoId: 'C_bS0-RmaG4'
  }
];

export const CONCERTS: Concert[] = [
  { id: 1, bandId: 1, bandName: 'ONE OK ROCK', date: '2024-10-25', venue: 'Movistar Arena', city: 'Santiago', ticketPrice: 55000, sections: [
      { name: 'Cancha', priceModifier: 1.2 },
      { name: 'Platea Baja', priceModifier: 1.0 },
      { name: 'Platea Alta', priceModifier: 0.8 },
      { name: 'Galería', priceModifier: 0.6 },
  ] },
  { id: 2, bandId: 2, bandName: 'BAND-MAID', date: '2024-11-12', venue: 'Teatro Caupolicán', city: 'Santiago', ticketPrice: 48000, sections: [
      { name: 'Cancha', priceModifier: 1.0 },
      { name: 'Platea', priceModifier: 0.9 },
      { name: 'Galería', priceModifier: 0.7 },
  ] },
  { id: 3, bandId: 3, bandName: 'the GazettE', date: '2025-02-08', venue: 'Teatro Teletón', city: 'Santiago', ticketPrice: 62000, sections: [
      { name: 'General', priceModifier: 1.0 },
  ] },
];

export const MERCH: Merch[] = [
  { id: 1, bandName: 'ONE OK ROCK', itemName: 'Logo T-Shirt', price: 25000, image: 'https://http2.mlstatic.com/D_NQ_NP_926316-MLC74182516783_012024-O-polera-one-ok-rock-logo.webp' },
  { id: 2, bandName: 'ONE OK ROCK', itemName: 'Ambitions Tour Hoodie', price: 45000, image: 'https://cycorecords.cl/cdn/shop/files/p-sk30032081-1-32d2ddc3-9321-4d2c-ba30-5009b5575337.png?v=1743349802&width=1214' },
  { id: 3, bandName: 'BAND-MAID', itemName: 'Unleash Tour Tee', price: 27000, image: 'https://images.teepublic.com/derived/production/designs/64069345_0/1722939669/i_m:bi_production_blanks_mtl53ofohwq5goqjo9ke_1462829015,c_0_0_470x,s_313,q_90.jpg' },
  { id: 4, bandName: 'BAND-MAID', itemName: 'Maid Headband', price: 15000, image: 'https://patch-shop.com/public/cache/image/seo/band-maid-patch-antsiuvas-25968f.jpg' },
  { id: 5, bandName: 'the GazettE', itemName: 'NINTH Album Art Flag', price: 30000, image: 'https://http2.mlstatic.com/D_NQ_NP_913572-MLM48441651269_122021-O.webp' },
  { id: 6, bandName: 'the GazettE', itemName: 'Dogma Keychain', price: 12000, image: 'https://i.ebayimg.com/thumbs/images/g/r6AAAOSwNcdnQIHs/s-l1200.jpg' },
];

export const NEW_RELEASES: NewRelease[] = [
  {
    id: 1,
    bandName: 'ONE OK ROCK',
    releaseTitle: 'Luxury Disease',
    releaseType: 'Album',
    releaseDate: '2022-09-09',
    coverArt: 'https://i.discogs.com/OnzYr-HuUHvCv01o18jSUPNH3-BU_DhBxvwX_n88MRQ/rs:fit/g:sm/q:90/h:500/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4NTM0/MjgtMTQ4NzQxNjkx/Ny02MzY1LmpwZWc.jpeg',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/album/43zN281dSoq23i3n0g474W?utm_source=generator'
  },
  {
    id: 2,
    bandName: 'BAND-MAID',
    releaseTitle: 'Unleash',
    releaseType: 'EP',
    releaseDate: '2022-09-21',
    coverArt: 'https://static.wikia.nocookie.net/visualkei/images/1/15/BAND-MAID_-_Just_Bring_It.jpg/revision/latest/scale-to-width-down/1200?cb=20250102190359&path-prefix=es',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/album/52Ifedaad22EaN24eAPdJ8?utm_source=generator'
  },
  {
    id: 3,
    bandName: 'the GazettE',
    releaseTitle: 'MASS',
    releaseType: 'Album',
    releaseDate: '2021-05-26',
    coverArt: 'https://i.discogs.com/2Q4xz52YntExtjVKroEj2pRTT_CL9j6gr6ofJ7JsULE/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0NTU0/MDUtMTM1Nzg1NzI1/OC01NjgxLmpwZWc.jpeg',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/album/1L3JCf4RBnJ2I8k3aJvT1A?utm_source=generator'
  },
  {
    id: 4,
    bandName: 'ONE OK ROCK',
    releaseTitle: 'Renegades',
    releaseType: 'Single',
    releaseDate: '2021-04-16',
    coverArt: 'https://d3e6ckxkrs5ntg.cloudfront.net/artists/images/5190991/original/resize:600x625/crop:x0y27w450h337/aspect:1.0/hash:1467698223/1452830881_site.jpg?1467698223',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/32aWG2L902Dq2nAxnS1g55?utm_source=generator'
  }
];
