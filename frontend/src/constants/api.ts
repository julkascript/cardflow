const base = `${import.meta.env.VITE_API_URL}/api`;
const accounts = `${base}/accounts`;
const listing = `${base}/listing`;
const contacts = `${base}/contacts`;
const yugioh = `${base}/yugioh`;
const cardInSet = `${yugioh}/cards_in_set`;
const card = `${yugioh}/cards`;
const shoppingCart = `${base}/cart`;
const bestSeller = `${base}/bestseller`;
const feedback = `${base}/feedback`;
const orders = `${base}/order`;
const trade = `${base}/trade`;

export const api = Object.freeze({
  accounts: {
    refresh: `${accounts}/refresh/`,
    register: `${accounts}/register/`,
    login: `${accounts}/login/`,
    user: `${accounts}/user/`,
    userById: (id: string | number) => `${accounts}/user/${id}/`,
    searchByUsername: `${accounts}/users/search`,
  },
  contacts: {
    root: `${contacts}/`,
  },
  bestSeller: {
    root: `${bestSeller}/`,
  },
  yugioh: {
    listing: {
      root: listing,
      id: (id: number | string) => `${listing}/${id}/`,
      buyById: (id: number | string) => `${listing}/${id}/buy/`,
      sellListing: () => `${listing}/`,
    },
    cardInSet: {
      root: cardInSet,
      id: (id: number | string) => `${cardInSet}/${id}`,
    },
    cards: {
      root: card,
      id: (id: number | string) => `${card}/${id}`,
    },
  },
  shoppingCart: {
    items: `${shoppingCart}/items/`,
    id: (id: number | string) => `${shoppingCart}/items/${id}/`,
    checkout: `${shoppingCart}/items/checkout/`,
  },
  feedback: {
    root: feedback + '/',
    user: (id: string | number) => `${feedback}/user/${id}`,
  },
  orders: {
    root: orders + '/',
    id: (id: number | string) => `${orders}/${id}/`,
  },
  trade: {
    root: trade + '/',
    id: (id: number | string) => `${trade}/${id}/`,
    negotiate: (id: number | string) => `${trade}/${id}/negotiate/`,
    accept: (id: number | string) => `${trade}/${id}/accept/`,
    reject: (id: number | string) => `${trade}/${id}/reject/`,
    counterOffer: (id: number | string) => `${trade}/${id}/counter-offer/`,
  },
});
