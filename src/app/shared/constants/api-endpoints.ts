const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    account: `${API_BASE_URL}/auth/account`,
  },
} as const;

