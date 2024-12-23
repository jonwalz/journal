import { WebSocketClient } from "./websocket.client";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChatResponse {
  message: string;
  id: string;
}

export class ChatClientError extends Error {
  constructor(
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "ChatClientError";
  }
}

export class ChatClient {
  private static messageCallbacks: Map<
    string,
    (response: IChatResponse) => void
  > = new Map();
  private static isInitialized = false;
  private static connectionPromise: Promise<void> | null = null;
  private static isCleaningUp = false;

  private static async ensureConnection(): Promise<void> {
    console.log("ChatClient: Ensuring connection...");
    if (this.isInitialized && !this.isCleaningUp) {
      console.log("ChatClient: Connection already initialized");
      return;
    }

    if (this.connectionPromise) {
      console.log("ChatClient: Connection in progress, waiting...");
      try {
        await this.connectionPromise;
        console.log("ChatClient: Existing connection promise resolved");
        return;
      } catch (error) {
        console.error("ChatClient: Existing connection promise failed:", error);
        this.connectionPromise = null;
      }
    }

    if (!this.isCleaningUp) {
      console.log("ChatClient: Starting new connection");
      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
          WebSocketClient.connectWebSocket({
            onMessage: (data) => {
              console.log("ChatClient: Received message, Data: ", data);
              const response = data as IChatResponse;
              const callback = this.messageCallbacks.get(response.id);
              if (callback) {
                console.log(
                  "ChatClient: Found callback for message:",
                  response.id
                );
                callback(response);
                this.messageCallbacks.delete(response.id);
              } else {
                console.log(
                  "ChatClient: No callback found for message:",
                  response.id
                );
              }
            },
            onError: (error) => {
              console.error("ChatClient: WebSocket error:", error);
              this.isInitialized = false;
              this.connectionPromise = null;
              reject(error);
            },
            onClose: () => {
              if (!this.isCleaningUp) {
                console.log("ChatClient: WebSocket closed unexpectedly");
                this.isInitialized = false;
                this.connectionPromise = null;
              }
            },
            reconnectAttempts: 5,
            reconnectInterval: 5000,
          })
            .then(() => {
              console.log("ChatClient: WebSocket connection established");
              this.isInitialized = true;
              resolve();
            })
            .catch(reject);
        } catch (error) {
          console.error("ChatClient: Failed to initialize connection:", error);
          this.connectionPromise = null;
          reject(error);
        }
      });

      try {
        console.log("ChatClient: Waiting for connection to be ready...");
        await this.connectionPromise;
        console.log("ChatClient: Connection ready");
      } catch (error) {
        console.error("ChatClient: Connection failed:", error);
        this.connectionPromise = null;
        throw error;
      }
    } else {
      console.log("ChatClient: Skipping connection due to cleanup in progress");
    }
  }

  static async sendMessage(
    message: string,
    userId: string
  ): Promise<IChatResponse> {
    await this.ensureConnection();
    if (message.trim() === "") {
      console.log("ChatClient: Connection test message");
      return { id: "connection-test", message: "" };
    }

    console.log("ChatClient: Sending message...");
    return new Promise((resolve, reject) => {
      try {
        const messageId = crypto.randomUUID();
        console.log("ChatClient: Created message ID:", messageId);

        const payload = {
          type: "chat_message",
          payload: {
            id: messageId,
            message,
            timestamp: new Date().toISOString(),
            userId,
          },
        };

        console.log("ChatClient: Setting up callback for message:", messageId);
        this.messageCallbacks.set(messageId, resolve);

        WebSocketClient.sendWebSocketMessage(payload).catch((error) => {
          console.error("ChatClient: Failed to send message:", error);
          this.messageCallbacks.delete(messageId);
          this.isInitialized = false;
          this.connectionPromise = null;
          reject(new ChatClientError("Failed to send message", error));
        });

        // Set a timeout to clean up the callback if no response is received
        setTimeout(() => {
          if (this.messageCallbacks.has(messageId)) {
            console.warn("ChatClient: Message timeout:", messageId);
            this.messageCallbacks.delete(messageId);
            reject(new ChatClientError("Message response timeout"));
          }
        }, 30000); // 30 second timeout
      } catch (error) {
        console.error("ChatClient: Error in sendMessage:", error);
        reject(new ChatClientError("Failed to send message", error));
      }
    });
  }

  static cleanup(): void {
    console.log("ChatClient: Starting cleanup");
    this.isCleaningUp = true;
    WebSocketClient.closeWebSocket();
    this.messageCallbacks.clear();
    this.isInitialized = false;
    this.connectionPromise = null;
    this.isCleaningUp = false;
    console.log("ChatClient: Cleanup complete");
  }
}
