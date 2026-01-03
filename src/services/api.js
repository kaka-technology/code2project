// ============================================
// Code2Project - API Service Layer
// ============================================

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://api.code2project.dev',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * HTTP request methods
 */
const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * API error codes
 */
const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
};

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, code, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Request interceptor to add auth tokens
 */
function requestInterceptor(config) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

/**
 * Response interceptor to handle errors
 */
function responseInterceptor(response) {
  if (response.ok) {
    return response.json().catch(() => response);
  }

  // Handle different error status codes
  const { status } = response;
  
  if (status === 401) {
    // Unauthorized - clear auth and redirect to login
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new APIError(
      'Unauthorized access',
      ERROR_CODES.UNAUTHORIZED,
      status
    );
  }

  if (status === 403) {
    throw new APIError(
      'Access forbidden',
      ERROR_CODES.FORBIDDEN,
      status
    );
  }

  if (status === 404) {
    throw new APIError(
      'Resource not found',
      ERROR_CODES.NOT_FOUND,
      status
    );
  }

  if (status >= 500) {
    throw new APIError(
      'Server error occurred',
      ERROR_CODES.SERVER_ERROR,
      status
    );
  }

  if (status >= 400) {
    throw new APIError(
      'Bad request',
      ERROR_CODES.CLIENT_ERROR,
      status
    );
  }

  throw new APIError(
    'Unknown error occurred',
    'UNKNOWN_ERROR',
    status
  );
}

/**
 * Make HTTP request with fetch API
 */
async function makeRequest(method, endpoint, data = null, options = {}) {
  const config = {
    method,
    headers: { ...API_CONFIG.headers, ...options.headers },
    signal: options.signal,
  };

  // Add body for POST/PUT/PATCH requests
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    config.body = JSON.stringify(data);
  }

  // Add query params for GET requests
  let url = `${API_CONFIG.baseURL}${endpoint}`;
  if (data && method === 'GET') {
    const params = new URLSearchParams(data);
    url += `?${params.toString()}`;
  }

  try {
    // Apply request interceptor
    const interceptedConfig = requestInterceptor(config);
    
    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || API_CONFIG.timeout
    );

    const response = await fetch(url, {
      ...interceptedConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Apply response interceptor
    return await responseInterceptor(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new APIError(
        'Request timeout',
        ERROR_CODES.TIMEOUT_ERROR,
        408
      );
    }

    if (!navigator.onLine) {
      throw new APIError(
        'Network connection lost',
        ERROR_CODES.NETWORK_ERROR,
        0
      );
    }

    throw error instanceof APIError
      ? error
      : new APIError(
          error.message || 'Unknown error',
          'UNKNOWN_ERROR',
          0,
          error
        );
  }
}

/**
 * GET request
 */
export async function get(endpoint, params = null, options = {}) {
  return makeRequest(REQUEST_METHODS.GET, endpoint, params, options);
}

/**
 * POST request
 */
export async function post(endpoint, data = null, options = {}) {
  return makeRequest(REQUEST_METHODS.POST, endpoint, data, options);
}

/**
 * PUT request
 */
export async function put(endpoint, data = null, options = {}) {
  return makeRequest(REQUEST_METHODS.PUT, endpoint, data, options);
}

/**
 * PATCH request
 */
export async function patch(endpoint, data = null, options = {}) {
  return makeRequest(REQUEST_METHODS.PATCH, endpoint, data, options);
}

/**
 * DELETE request
 */
export async function del(endpoint, options = {}) {
  return makeRequest(REQUEST_METHODS.DELETE, endpoint, null, options);
}

/**
 * Upload file with progress tracking
 */
export async function uploadFile(endpoint, file, onProgress = null) {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        reject(
          new APIError(
            'Upload failed',
            ERROR_CODES.SERVER_ERROR,
            xhr.status
          )
        );
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(
        new APIError(
          'Network error during upload',
          ERROR_CODES.NETWORK_ERROR,
          0
        )
      );
    });

    xhr.addEventListener('timeout', () => {
      reject(
        new APIError(
          'Upload timeout',
          ERROR_CODES.TIMEOUT_ERROR,
          408
        )
      );
    });

    // Send request
    const token = localStorage.getItem('auth_token');
    xhr.open('POST', `${API_CONFIG.baseURL}${endpoint}`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.timeout = API_CONFIG.timeout;
    xhr.send(formData);
  });
}

/**
 * Download file
 */
export async function downloadFile(endpoint, filename = null) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      headers: requestInterceptor({ headers: API_CONFIG.headers }).headers,
    });

    if (!response.ok) {
      throw new APIError(
        'Download failed',
        ERROR_CODES.SERVER_ERROR,
        response.status
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    throw error instanceof APIError
      ? error
      : new APIError(
          'Download failed',
          ERROR_CODES.SERVER_ERROR,
          0,
          error
        );
  }
}

/**
 * Batch requests (execute multiple requests in parallel)
 */
export async function batchRequests(requests) {
  try {
    const results = await Promise.allSettled(
      requests.map((req) => makeRequest(req.method, req.endpoint, req.data, req.options))
    );

    return results.map((result, index) => ({
      request: requests[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  } catch (error) {
    throw new APIError(
      'Batch request failed',
      'BATCH_ERROR',
      0,
      error
    );
  }
}

/**
 * Retry failed request with exponential backoff
 */
export async function retryRequest(
  requestFn,
  maxRetries = 3,
  initialDelay = 1000
) {
  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        // Wait before retrying with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for next retry
      }
    }
  }

  throw new APIError(
    `Request failed after ${maxRetries} retries`,
    'MAX_RETRIES_EXCEEDED',
    0,
    lastError
  );
}

/**
 * Cache manager for API responses
 */
class CacheManager {
  constructor(ttl = 5 * 60 * 1000) {
    // Default TTL: 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }

  generateKey(endpoint, params = null) {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  get(endpoint, params = null) {
    const key = this.generateKey(endpoint, params);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    // Remove expired cache
    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  set(endpoint, params = null, data) {
    const key = this.generateKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(endpoint = null, params = null) {
    if (endpoint) {
      const key = this.generateKey(endpoint, params);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export cache manager instance
export const cache = new CacheManager();

/**
 * Cached GET request
 */
export async function getCached(endpoint, params = null, options = {}) {
  // Check cache first
  const cached = cache.get(endpoint, params);
  if (cached && !options.forceRefresh) {
    return cached;
  }

  // Make request and cache result
  const data = await get(endpoint, params, options);
  cache.set(endpoint, params, data);
  return data;
}

/**
 * API service object
 */
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  getCached,
  uploadFile,
  downloadFile,
  batchRequests,
  retryRequest,
  cache,
  config: API_CONFIG,
  errorCodes: ERROR_CODES,
  APIError,
};

// Export as default
export default api;
