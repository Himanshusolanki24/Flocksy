const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong');
  }

  return data;
};

export const authApi = {
  login: (credentials) => api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => api('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getProfile: () => api('/users/profile'),
};

export const diagnosisApi = {
  uploadImage: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/diagnosis/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Upload failed');
    return data;
  },
  sendChatQuery: (query, lang = 'en') => api(`/diagnosis/chat?lang=${lang}`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  }),
};

export const dashboardApi = {
  getSummary: () => api('/dashboard/summary'),
};

export const vetApi = {
  listVets: () => api('/vets'),
  getVetDetails: (id) => api(`/vets/${id}`),
};

export default api;
