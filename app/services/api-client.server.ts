import { getSession } from "./session.server";

const API_BASE_URL = process.env.API_URL || "http://localhost:3030";

export interface RequestOptions extends RequestInit {
  data?: unknown;
  headers?: { [key: string]: string };
}

interface ApiResponse<T> {
  data: T;
  headers: { [key: string]: string };
}

interface IWebSocketMessage {
  type: string;
  payload: unknown;
}

interface IWebSocketConfig {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

export class ApiClient {
  private static wsConnection: WebSocket | null = null;
  private static wsConfig: IWebSocketConfig = {
    reconnectAttempts: 3,
    reconnectInterval: 3000,
  };
  private static reconnectAttempt = 0;
  private static reconnectTimeout: NodeJS.Timeout | null = null;

  static connectWebSocket(config: Partial<IWebSocketConfig> = {}): WebSocket {
    this.wsConfig = { ...this.wsConfig, ...config };

    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      return this.wsConnection;
    }

    const wsBaseUrl = API_BASE_URL.replace(/^http/, "ws");
    const wsUrl = `${wsBaseUrl}/chat`;

    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onopen = () => {
      this.reconnectAttempt = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.wsConnection.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as IWebSocketMessage;
        this.wsConfig.onMessage?.(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.wsConnection.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
      this.wsConfig.onError?.(error);
    };

    this.wsConnection.onclose = () => {
      this.wsConfig.onClose?.();
      this.handleReconnection();
    };

    return this.wsConnection;
  }

  private static handleReconnection(): void {
    if (
      this.reconnectAttempt < (this.wsConfig.reconnectAttempts ?? 3) &&
      !this.reconnectTimeout
    ) {
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempt++;
        console.log(`Attempting to reconnect (${this.reconnectAttempt})`);
        this.connectWebSocket(this.wsConfig);
        this.reconnectTimeout = null;
      }, this.wsConfig.reconnectInterval);
    }
  }

  static sendWebSocketMessage(message: IWebSocketMessage): void {
    if (this.wsConnection?.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    this.wsConnection.send(JSON.stringify(message));
  }

  static closeWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
      this.reconnectAttempt = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
  }

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
