const API_BASE_URL = "http://localhost:3030";

interface RequestOptions extends RequestInit {
  data?: unknown;
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
    const { data, ...customOptions } = options;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    };

    const fetchOptions: RequestInit = {
      ...defaultOptions,
      ...customOptions,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
      const json = await response.json();
      console.log("Response: ", json);
      return { data: json, headers: Object.fromEntries(response.headers) };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "POST", data });
  }

  static put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PUT", data });
  }

  static delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
