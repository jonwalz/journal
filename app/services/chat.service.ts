import { ApiClient } from "./api-client.server";

export class ChatServiceError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
}

export class ChatService {
  static async sendMessage(
    message: string,
    request: Request
  ): Promise<ChatResponse> {
    try {
      const response = await ApiClient.postProtected<ChatResponse>(
        "/ai/chat",
        request,
        { message }
      );
      return response.data;
    } catch (error) {
      throw new ChatServiceError("Failed to send message", error);
    }
  }
}
