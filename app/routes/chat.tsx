import { json, SerializeFrom } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MainLayout } from "~/layouts/MainLayout";
import { cn } from "~/lib/utils";
import { ChatService, ChatServiceError } from "~/services/chat.service";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "sending" | "error";
}

type ActionData = SerializeFrom<
  { message: string; error?: never } | { message?: never; error: string }
>;

function isSuccessResponse(
  data: ActionData
): data is SerializeFrom<{ message: string; error?: never }> {
  return "message" in data && !("error" in data);
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const message = formData.get("message") as string;

  try {
    const response = await ChatService.sendMessage(message, request);
    return json<ActionData>({ message: response.message });
  } catch (error) {
    const errorMessage =
      error instanceof ChatServiceError
        ? error.message
        : "Failed to send message";
    return json<ActionData>({ error: errorMessage }, { status: 500 });
  }
}

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const fetcher = useFetcher<typeof action>();

  // Handle form submission with optimistic UI
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("message") as string;

    if (!content.trim()) return;

    // Generate a temporary ID for optimistic updates
    const tempId = `temp-${Date.now()}`;

    // Add optimistic message
    const optimisticMessage: Message = {
      id: tempId,
      role: "user",
      content,
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Submit the form using fetcher
    fetcher.submit(formData, { method: "post" });
    form.reset();
  };

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data && isSuccessResponse(fetcher.data)) {
      // This narrows the type
      setMessages((currentMessages) => {
        const pendingMessageIndex = currentMessages.findIndex(
          (m) => m.status === "sending"
        );
        if (pendingMessageIndex === -1) return currentMessages;

        const updatedMessages = [...currentMessages];
        // Update the pending message status
        updatedMessages[pendingMessageIndex] = {
          ...updatedMessages[pendingMessageIndex],
          status: undefined,
        };

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            fetcher.data && isSuccessResponse(fetcher.data)
              ? fetcher.data.message
              : "",
        };

        updatedMessages.push(assistantMessage);
        return updatedMessages;
      });
    }
  }, [fetcher.data]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-4 rounded-base border-2 border-border dark:border-darkBorder max-w-3xl",
                message.role === "user"
                  ? "bg-white dark:bg-secondaryBlack ml-auto text-right"
                  : "bg-main mr-auto",
                message.status === "sending" && "opacity-70"
              )}
            >
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {message.status === "sending" && (
                  <span className="text-sm text-gray-500 ml-2">Sending...</span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <Form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
          <Input
            name="message"
            placeholder="Type your message..."
            className="flex-1"
            required
            disabled={fetcher.state !== "idle"}
          />
          <Button
            type="submit"
            disabled={fetcher.state !== "idle"}
            variant="default"
          >
            {fetcher.state !== "idle" ? "Sending..." : "Send"}
          </Button>
        </Form>
      </div>
    </MainLayout>
  );
}
