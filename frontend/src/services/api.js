import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const friendsAPI = {
  addFriend: (username) => api.post('/friends/add', { username }),
  getFriends: () => api.get('/friends'),
  removeFriend: (friendId) => api.delete(`/friends/${friendId}`),
};

export const transactionsAPI = {
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  getTransactions: () => api.get('/transactions'),
  getTransactionsWithFriend: (friendId) => api.get(`/transactions/friend/${friendId}`),
};

export const balancesAPI = {
  getBalances: () => api.get('/balances'),
  getBalanceWithFriend: (friendId) => api.get(`/balances/friend/${friendId}`),
};

export default api;
