const base = `${import.meta.env.VITE_API_URL}/api`;
const accounts = `${base}/accounts`;

export const api = Object.freeze({
  accounts: {
    refresh: `${accounts}/refresh/`,
    register: `${accounts}/register/`,
    login: `${accounts}/login/`,
  },
});
