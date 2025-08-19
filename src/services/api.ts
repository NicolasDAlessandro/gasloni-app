import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../types/Api';
import type { LoginResponse, ApiResponse, ProductDto } from '../types/Api';

// Configuración base de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función genérica para hacer peticiones
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error en petición ${method} ${url}:`, error);
    throw error;
  }
};

// Servicios específicos
export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    return apiRequest<LoginResponse>('POST', API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
  },

  refreshToken: async () => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  },

  logout: async () => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  },
};

export const productService = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    sellerId?: string;
  }) => {
    return apiRequest<ApiResponse<ProductDto[]>>('GET', API_CONFIG.ENDPOINTS.PRODUCTS.LIST, undefined, { params });
  },

  getById: async (id: string) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  create: async (product: any) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, product);
  },

  update: async (id: string, product: any) => {
    return apiRequest('PUT', API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id), product);
  },

  delete: async (id: string) => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.PRODUCTS.DELETE(id));
  },

  getBySeller: async (sellerId: string) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.PRODUCTS.BY_SELLER(sellerId));
  },
};

export const cartService = {
  getCart: async () => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.CART.GET);
  },

  addItem: async (productId: string, quantity: number) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.CART.ADD, { productId, quantity });
  },

  updateItem: async (itemId: string, quantity: number) => {
    return apiRequest('PUT', API_CONFIG.ENDPOINTS.CART.UPDATE(itemId), { quantity });
  },

  removeItem: async (itemId: string) => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.CART.REMOVE(itemId));
  },

  clearCart: async () => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.CART.CLEAR);
  },
};

export const paymentService = {
  createPayment: async (paymentData: any) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, paymentData);
  },

  getPayments: async (params?: { page?: number; pageSize?: number }) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.PAYMENTS.LIST, undefined, { params });
  },

  getPayment: async (id: string) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.PAYMENTS.DETAIL(id));
  },

  updatePayment: async (id: string, status: string) => {
    return apiRequest('PUT', API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE(id), { status });
  },
};

export const budgetService = {
  createBudget: async (budgetData: any) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.BUDGETS.CREATE, budgetData);
  },

  getBudgets: async (params?: { page?: number; pageSize?: number }) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.BUDGETS.LIST, undefined, { params });
  },

  getBudget: async (id: string) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.BUDGETS.DETAIL(id));
  },

  sendBudget: async (id: string) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.BUDGETS.SEND(id));
  },

  acceptBudget: async (id: string) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.BUDGETS.ACCEPT(id));
  },

  rejectBudget: async (id: string) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.BUDGETS.REJECT(id));
  },
};

export default apiClient;
