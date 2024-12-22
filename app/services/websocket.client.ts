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

export class WebSocketClient {
  private static wsConnection: WebSocket | null = null;
  private static wsConfig: IWebSocketConfig = {
    reconnectAttempts: 3,
    reconnectInterval: 3000,
  };
  private static readonly CONNECTION_TIMEOUT = 5000; // 5 seconds timeout
  private static reconnectAttempt = 0;
  private static reconnectTimeout: number | null = null;
  private static isConnecting = false;
  private static connectionPromise: Promise<WebSocket> | null = null;

  static async connectWebSocket(
    config: Partial<IWebSocketConfig> = {}
  ): Promise<WebSocket> {
    console.log("WebSocketClient: Starting connection attempt");
    this.wsConfig = { ...this.wsConfig, ...config };

    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      console.log("WebSocketClient: Reusing existing open connection");
      return this.wsConnection;
    }

    if (this.connectionPromise) {
      console.log(
        "WebSocketClient: Connection already in progress, waiting..."
      );
      return this.connectionPromise;
    }

    this.isConnecting = true;
    console.log("WebSocketClient: Creating new connection");

    this.connectionPromise = new Promise((resolve, reject) => {
      const wsUrl = `ws://localhost:3030/chat`;
      console.log("WebSocketClient: Connecting to", wsUrl);

      if (this.wsConnection?.readyState === WebSocket.CONNECTING) {
        console.log("WebSocketClient: Closing existing connecting socket");
        this.wsConnection.close();
      }

      this.wsConnection = new WebSocket(wsUrl);

      // Add connection timeout
      const timeoutId = setTimeout(() => {
        if (this.wsConnection?.readyState !== WebSocket.OPEN) {
          console.log(
            "WebSocketClient: Connection timeout after",
            this.CONNECTION_TIMEOUT,
            "ms"
          );
          this.wsConnection?.close();
          reject(new Error("Connection timeout"));
        }
      }, this.CONNECTION_TIMEOUT);

      this.wsConnection.onopen = () => {
        clearTimeout(timeoutId);
        console.log("WebSocketClient: Connection opened successfully");
        this.reconnectAttempt = 0;
        this.isConnecting = false;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        resolve(this.wsConnection!);
      };

      this.wsConnection.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as IWebSocketMessage;
          console.log("WebSocketClient: Received message:", data.type);
          this.wsConfig.onMessage?.(data.payload);
        } catch (error) {
          console.error("WebSocketClient: Failed to parse message:", error);
        }
      };

      this.wsConnection.onerror = (error: Event) => {
        clearTimeout(timeoutId);
        console.error("WebSocketClient: Connection error details:", {
          readyState: this.wsConnection?.readyState,
          error: error,
          url: wsUrl,
          reconnectAttempt: this.reconnectAttempt,
        });
        this.isConnecting = false;
        this.connectionPromise = null;
        this.wsConfig.onError?.(error);
        reject(error);
        this.handleReconnection();
      };

      this.wsConnection.onclose = (event) => {
        clearTimeout(timeoutId);
        console.log("WebSocketClient: Connection closed", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          readyState: this.wsConnection?.readyState,
          reconnectAttempt: this.reconnectAttempt,
        });
        this.isConnecting = false;
        this.connectionPromise = null;
        this.wsConfig.onClose?.();
        this.handleReconnection();
      };
    });

    return this.connectionPromise;
  }

  private static handleReconnection(): void {
    if (this.wsConnection?.readyState === WebSocket.CONNECTING) {
      console.log("WebSocketClient: Already attempting to connect");
      return;
    }

    if (this.reconnectAttempt >= (this.wsConfig.reconnectAttempts ?? 3)) {
      console.log(
        "WebSocketClient: Max reconnection attempts reached",
        this.reconnectAttempt
      );
      return;
    }

    this.reconnectAttempt++;
    console.log(
      `WebSocketClient: Attempting reconnection ${this.reconnectAttempt}/${
        this.wsConfig.reconnectAttempts ?? 3
      } in ${this.wsConfig.reconnectInterval}ms`
    );

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = window.setTimeout(() => {
      void this.connectWebSocket(this.wsConfig);
    }, this.wsConfig.reconnectInterval);
  }

  static async sendWebSocketMessage(message: IWebSocketMessage): Promise<void> {
    console.log("WebSocketClient: Attempting to send message:", message.type);
    const connection = await this.connectWebSocket();
    if (connection.readyState !== WebSocket.OPEN) {
      console.error(
        "WebSocketClient: Connection not open, state:",
        connection.readyState
      );
      throw new Error("WebSocket is not connected");
    }

    connection.send(JSON.stringify(message));
    console.log("WebSocketClient: Message sent successfully");
  }

  static closeWebSocket(): void {
    if (this.wsConnection && !this.isConnecting) {
      this.wsConnection.close();
      this.wsConnection = null;
      this.connectionPromise = null;
      this.reconnectAttempt = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
  }
}
