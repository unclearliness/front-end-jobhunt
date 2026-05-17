const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    account: `${API_BASE_URL}/auth/account`,
    register: `${API_BASE_URL}/auth/register`,
    registerHr: `${API_BASE_URL}/auth/register/hr`,
  },
} as const;

