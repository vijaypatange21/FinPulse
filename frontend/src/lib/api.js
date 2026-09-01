const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
const TOKEN_KEY = 'finpulse_token';
const USER_KEY = 'finpulse_user';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveAuthSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const { method = 'GET', body, headers = {}, auth = true } = options;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const requestHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(auth && token ? { Authorization: `Token ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.message ||
      payload?.non_field_errors?.[0] ||
      'Request failed.';
    throw new Error(message);
  }

  return payload;
}

export async function login(usernameOrEmail, password) {
  return apiRequest('/auth/login/', {
    method: 'POST',
    auth: false,
    body: {
      username_or_email: usernameOrEmail,
      password,
    },
  });
}

export async function registerBorrower(payload) {
  return apiRequest('/auth/register/borrower/', {
    method: 'POST',
    auth: false,
    body: payload,
  });
}

export async function registerLender(payload) {
  return apiRequest('/auth/register/lender/', {
    method: 'POST',
    auth: false,
    body: payload,
  });
}

export async function listBorrowers() {
  return apiRequest('/borrowers/');
}

export async function listApplications() {
  return apiRequest('/applications/');
}

export async function listLenders() {
  return apiRequest('/lenders/');
}

export async function createLoanApplication(payload) {
  return apiRequest('/applications/', {
    method: 'POST',
    body: payload,
  });
}

export async function getBorrowerById(id) {
  return apiRequest(`/borrowers/${id}/`);
}

export async function getApplicationById(id) {
  return apiRequest(`/applications/${id}/`);
}

export async function updateApplicationStatus(id, status, note = '') {
  return apiRequest(`/applications/${id}/`, {
    method: 'PATCH',
    body: { status, note },
  });
}

export async function predictHealthScore(features) {
  return apiRequest('/predict/health-score/', {
    method: 'POST',
    body: { features },
    auth: false,
  });
}

export async function predictDefaultRisk(features) {
  return apiRequest('/predict/default-risk/', {
    method: 'POST',
    body: { features },
    auth: false,
  });
}

export async function detectAnomaly(transaction) {
  return apiRequest('/detect/anomaly/', {
    method: 'POST',
    body: { transaction },
    auth: false,
  });
}

export async function forecastBalance(balanceHistory) {
  return apiRequest('/forecast/balance/', {
    method: 'POST',
    body: { balance_history: balanceHistory },
    auth: false,
  });
}

export async function recommendWellness(features) {
  return apiRequest('/recommend/wellness/', {
    method: 'POST',
    body: { features },
    auth: false,
  });
}

export async function listDocuments() {
  return apiRequest('/documents/', {
    method: 'GET',
    auth: true,
  });
}

export async function uploadDocument(formData) {
  return apiRequest('/documents/', {
    method: 'POST',
    body: formData,
    auth: true,
  });
}

export async function deleteDocument(id) {
  return apiRequest(`/documents/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}


