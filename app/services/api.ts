interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

interface ApiOptions {
  headers?: HeadersInit;
  timeout?: number;
}

export const api = {
  get: async <T>(url: string, options?: ApiOptions): Promise<T> => {
    try {
      const controller = new AbortController();
      const timeoutId = options?.timeout 
        ? setTimeout(() => controller.abort(), options.timeout)
        : null;

      const response = await fetch(url, {
        signal: controller.signal,
        headers: options?.headers,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
        error.status = response.status;
        error.data = await response.json().catch(() => null);
        throw error;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  },
  
  post: async <T>(url: string, data: unknown, options?: ApiOptions): Promise<T> => {
    try {
      const controller = new AbortController();
      const timeoutId = options?.timeout 
        ? setTimeout(() => controller.abort(), options.timeout)
        : null;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
        error.status = response.status;
        error.data = await response.json().catch(() => null);
        throw error;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }
};
