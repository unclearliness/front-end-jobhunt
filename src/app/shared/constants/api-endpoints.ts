const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    account: `${API_BASE_URL}/auth/account`,
    register: `${API_BASE_URL}/auth/register`,
    registerHr: `${API_BASE_URL}/auth/register/hr`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },
  jobs: {
    search: `${API_BASE_URL}/jobs`,
    create: `${API_BASE_URL}/jobs`,
    update: `${API_BASE_URL}/jobs`,
    detail: (id: number | string) => `${API_BASE_URL}/jobs/${id}`,
    byResume: `${API_BASE_URL}/jobs/by-resume`,
    byHr: `${API_BASE_URL}/jobs/by-hr`,
    delete: (id: number | string) => `${API_BASE_URL}/jobs/${id}`,
    byCompany: (id: number | string) => `${API_BASE_URL}/jobs/by-company/${id}`,


  },
  companies: {
    search: `${API_BASE_URL}/companies/search`,
    detail: (id: number | string) => `${API_BASE_URL}/companies/${id}`,
    logoBase: `${API_BASE_URL}/storage/uploads/`,
    create: `${API_BASE_URL}/companies`,
    update: `${API_BASE_URL}/companies`,
    delete: (id: number | string) => `${API_BASE_URL}/companies/${id}`,
  },
  files: {
    upload: `${API_BASE_URL}/files`,
  },
  resumes: {
    create: `${API_BASE_URL}/resumes`,
    update: `${API_BASE_URL}/resumes`,
    byHr: `${API_BASE_URL}/resumes/by-hr`,
  },
  users: {
    detail: (id: number | string) => `${API_BASE_URL}/users/${id}`,
    update: `${API_BASE_URL}/users`,
    create: `${API_BASE_URL}/users`,
    search: `${API_BASE_URL}/users`,
    delete: (id: number | string) => `${API_BASE_URL}/users/${id}`,
  },

  roles: {
    search: `${API_BASE_URL}/roles/search`,
    detail: (id: number | string) => `${API_BASE_URL}/roles/${id}`,
    create: `${API_BASE_URL}/roles`,
    update: `${API_BASE_URL}/roles`,
  },
  skills: `${API_BASE_URL}/skills`,
} as const;
