import { IChatResponse } from "./chat.client";

interface IChatMessage {
  id: string;
  message: string;
}

export class ChatServiceError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export class ChatService {
  static async handleMessage(
    message: string,
    messageId: string
  ): Promise<IChatResponse> {
    try {
      console.log("ChatService: Processing message:", { messageId, message });

      // Here you would implement your actual chat logic
      // For example, calling an AI service or processing the message
      const response: IChatResponse = {
        id: messageId,
        message: `Server received: ${message}`, // Replace with actual AI response
      };

      console.log("ChatService: Sending response:", response);
      return response;
    } catch (error) {
      console.error("ChatService: Error processing message:", error);
      throw new ChatServiceError("Failed to process message", error);
    }
  }
}
