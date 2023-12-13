const base = `${import.meta.env.VITE_API_URL}/api`;
const accounts = `${base}/accounts`;
const listing = `${base}/listing`;
const yugioh = `${base}/yugioh`;
const cardInSet = `${yugioh}/cards_in_set`;

export const api = Object.freeze({
  accounts: {
    refresh: `${accounts}/refresh/`,
    register: `${accounts}/register/`,
    login: `${accounts}/login/`,
  },
  yugioh: {
    listing: {
      root: listing,

      /** listing/{insert_your_id} */
      id: (id: number | string) => `${listing}/${id}`,
    },
    cardInSet: {
      root: cardInSet,
      id: (id: number | string) => `${cardInSet}/${id}`,
    },
  },
});
