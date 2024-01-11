const base = `${import.meta.env.VITE_API_URL}/api`;
const accounts = `${base}/accounts`;
const listing = `${base}/listing`;
const yugioh = `${base}/yugioh`;
const cardInSet = `${yugioh}/cards_in_set`;
const card = `${yugioh}/cards`;
export const api = Object.freeze({
  accounts: {
    refresh: `${accounts}/refresh/`,
    register: `${accounts}/register/`,
    login: `${accounts}/login/`,
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
});
