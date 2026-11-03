import { api } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then((r) => r.data),
};

export const dashboardApi = {
  get: (year?: number, month?: number) =>
    api
      .get('/dashboard', { params: { year, month } })
      .then((r) => r.data),
};

export const transactionsApi = {
  list: (params?: Record<string, string | undefined>) =>
    api.get('/transactions', { params }).then((r) => r.data),
  create: (body: unknown) => api.post('/transactions', body).then((r) => r.data),
  update: (id: string, body: unknown) =>
    api.patch(`/transactions/${id}`, body).then((r) => r.data),
  remove: (id: string) => api.delete(`/transactions/${id}`).then((r) => r.data),
};

export const accountsApi = {
  list: () => api.get('/accounts').then((r) => r.data),
  create: (body: unknown) => api.post('/accounts', body).then((r) => r.data),
};

export const cardsApi = {
  list: () => api.get('/cards').then((r) => r.data),
  create: (body: unknown) => api.post('/cards', body).then((r) => r.data),
};

export const categoriesApi = {
  list: (kind?: string) =>
    api.get('/categories', { params: { kind } }).then((r) => r.data),
};

export const budgetsApi = {
  list: () => api.get('/budgets').then((r) => r.data),
  create: (body: unknown) => api.post('/budgets', body).then((r) => r.data),
};

export const goalsApi = {
  list: () => api.get('/goals').then((r) => r.data),
  contribute: (id: string, amountCents: number) =>
    api.post(`/goals/${id}/contribute`, { amountCents }).then((r) => r.data),
  create: (body: unknown) => api.post('/goals', body).then((r) => r.data),
};

export const recurringApi = {
  list: () => api.get('/recurring').then((r) => r.data),
  forecast: () => api.get('/recurring/forecast/cashflow').then((r) => r.data),
};

export const reportsApi = {
  byCategory: () => api.get('/reports/expenses-by-category').then((r) => r.data),
  evolution: () => api.get('/reports/monthly-evolution').then((r) => r.data),
};

export const aiApi = {
  ask: (question: string) =>
    api.post('/ai/ask', { question }).then((r) => r.data),
  simulate: (description: string, amountCents: number) =>
    api.post('/ai/simulate', { description, amountCents }).then((r) => r.data),
  status: () => api.get('/ai/status').then((r) => r.data),
};
