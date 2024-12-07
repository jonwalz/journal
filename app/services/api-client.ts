import { getSession } from "./session.server";

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

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
      const json = await response.json();
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

  private static async addAuthHeaders(
    options: RequestOptions = {},
    request: Request
  ): Promise<RequestOptions> {
    const session = await getSession(request);
    const authToken = session.get("authToken");
    const sessionToken = session.get("sessionToken");

    if (!authToken || !sessionToken) {
      throw new Error("No auth token or session token found");
    }

    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    };
  }

  static async getProtected<T>(
    endpoint: string,
    request: Request,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, { ...protectedOptions, method: "GET" });
  }

  static async postProtected<T>(
    endpoint: string,
    request: Request,
    data?: unknown,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, {
      ...protectedOptions,
      method: "POST",
      data,
    });
  }

  static async putProtected<T>(
    endpoint: string,
    request: Request,
    data?: unknown,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, {
      ...protectedOptions,
      method: "PUT",
      data,
    });
  }

  static async deleteProtected<T>(
    endpoint: string,
    request: Request,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, { ...protectedOptions, method: "DELETE" });
  }
}
