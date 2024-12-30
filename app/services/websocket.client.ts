interface IWebSocketMessage {
  type: string;
  payload: {
    id: string;
    message: string; // Will contain stringified IChatMessage[]
    timestamp: string;
    userId: string;
  };
}

interface IWebSocketConfig {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  headers?: Record<string, string>;
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
      const getWebSocketUrl = () => {
        // In development, use localhost with specific port
        if (import.meta.env.DEV) {
          const serverPort = import.meta.env.PORT ?? 3030;
          return `ws://localhost:${serverPort}/ai/chat`;
        }

        // In production, use Render.com URL
        const wsProtocol = "wss:";
        const apiHost = "journal-up.onrender.com";

        console.log("WebSocketClient: Production URL details:", {
          wsProtocol,
          apiHost,
          windowLocation: {
            protocol: window.location.protocol,
            host: window.location.host,
            hostname: window.location.hostname,
            port: window.location.port,
            href: window.location.href,
            origin: window.location.origin,
          },
          url: `${wsProtocol}//${apiHost}/ai/chat`,
        });

        return `${wsProtocol}//${apiHost}/ai/chat`;
      };

      const wsUrl = getWebSocketUrl();
      console.log("WebSocketClient: Connecting to", wsUrl, {
        readyState: this.wsConnection?.readyState,
        existingUrl: this.wsConnection?.url,
        currentTime: new Date().toISOString(),
      });

      if (this.wsConnection?.readyState === WebSocket.CONNECTING) {
        console.log("WebSocketClient: Closing existing connecting socket");
        this.wsConnection.close();
      }

      this.wsConnection = new WebSocket(wsUrl);

      // Add connection timeout
      const timeoutId = setTimeout(() => {
        if (
          this.wsConnection &&
          this.wsConnection.readyState === WebSocket.CONNECTING
        ) {
          console.log(
            "WebSocketClient: Connection timeout, readyState:",
            this.wsConnection.readyState
          );
          this.wsConnection.close();
          reject(new Error("Connection timeout"));
        }
      }, this.CONNECTION_TIMEOUT);

      this.wsConnection.onopen = () => {
        console.log("WebSocketClient: Connection opened successfully", {
          url: wsUrl,
          readyState: this.wsConnection?.readyState,
          protocol: this.wsConnection?.protocol,
          extensions: this.wsConnection?.extensions,
        });
        clearTimeout(timeoutId);
        this.isConnecting = false;
        this.connectionPromise = null;
        this.reconnectAttempt = 0;
        resolve(this.wsConnection as WebSocket);
      };

      this.wsConnection.onmessage = (event) => {
        console.log("WebSocketClient: Message received", {
          data: event.data,
          type: event.type,
          origin: event.origin,
          lastEventId: event.lastEventId,
        });
        try {
          const data = JSON.parse(event.data);
          this.wsConfig.onMessage?.(data);
        } catch (error) {
          console.error("WebSocketClient: Error parsing message", error);
        }
      };

      this.wsConnection.onerror = (error: Event) => {
        console.error("WebSocketClient: Connection error details:", {
          error,
          readyState: this.wsConnection?.readyState,
          protocol: this.wsConnection?.protocol,
          extensions: this.wsConnection?.extensions,
          url: this.wsConnection?.url,
        });
        clearTimeout(timeoutId);
        this.isConnecting = false;
        this.connectionPromise = null;
        this.wsConfig.onError?.(error);
        reject(error);
        this.handleReconnection();
      };

      this.wsConnection.onclose = (event) => {
        console.error("WebSocketClient: Connection closed with details:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          type: event.type,
          protocols: this.wsConnection?.protocol,
          readyState: this.wsConnection?.readyState,
        });
        this.isConnecting = false;
        this.connectionPromise = null;
        this.wsConfig.onClose?.(event);
        reject(
          new Error(`WebSocket closed: ${event.reason || "Unknown reason"}`)
        );
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
