const API_BASE_URL = "http://localhost:3030";

export interface RequestOptions extends RequestInit {
  data?: unknown;
  headers?: { [key: string]: string };
}

interface ApiResponse<T> {
  data: T;
  headers: { [key: string]: string };
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { data, headers: customHeaders, ...customOptions } = options;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      credentials: "include",
    };

    const fetchOptions: RequestInit = {
      ...defaultOptions,
      ...customOptions,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    return {
      data: responseData,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  static async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static async post<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      data,
    });
  }

  static async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      data,
    });
  }

  static async delete(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<void> {
    await this.request(endpoint, { ...options, method: "DELETE" });
  }
}
