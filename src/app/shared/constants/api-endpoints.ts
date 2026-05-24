const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    account: `${API_BASE_URL}/auth/account`,
    register: `${API_BASE_URL}/auth/register`,
    registerHr: `${API_BASE_URL}/auth/register/hr`,
  },
  jobs: {
    search: `${API_BASE_URL}/jobs`,
    detail: (id: number | string) => `${API_BASE_URL}/jobs/${id}`,
    byResume: `${API_BASE_URL}/jobs/by-resume`,


  },
  companies: {
    search: `${API_BASE_URL}/companies/search`,
    detail: (id: number | string) => `${API_BASE_URL}/companies/${id}`,
    logoBase: `${API_BASE_URL}/storage/company-logos/`,
  },
  files: {
    upload: `${API_BASE_URL}/files`,
  },
  resumes: {
    create: `${API_BASE_URL}/resumes`,
  },
  users: {
    detail: (id: number | string) => `${API_BASE_URL}/users/${id}`,
    update: `${API_BASE_URL}/users`,
  },
} as const;
