import { json, SerializeFrom } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ApiClient } from "~/services/api-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MainLayout } from "~/layouts/MainLayout";
import { cn } from "~/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ActionData = SerializeFrom<
  { message: string; error?: never } | { message?: never; error: string }
>;

function isSuccessResponse(
  data: ActionData
): data is SerializeFrom<{ message: string; error?: never }> {
  return "message" in data;
}

function isErrorResponse(
  data: ActionData
): data is SerializeFrom<{ message?: never; error: string }> {
  return "error" in data;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const message = formData.get("message") as string;

  try {
    const response = await ApiClient.post<{ response: string }>("/chat", {
      data: { message },
    });

    return json<ActionData>({ message: response.data.response });
  } catch (error) {
    return json<ActionData>(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export default function Chat() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (actionData && isSuccessResponse(actionData)) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: actionData.message },
      ]);
    } else if (actionData && isErrorResponse(actionData)) {
      console.error(actionData.error);
    }
  }, [actionData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;

    if (message.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
    }
  };

  const isSubmitting = navigation.state === "submitting";

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-base border-2 border-border dark:border-darkBorder",
                message.role === "user"
                  ? "bg-white dark:bg-secondaryBlack ml-8"
                  : "bg-main mr-8"
              )}
            >
              <p className="text-text dark:text-darkText">{message.content}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <Form
          ref={formRef}
          method="post"
          className="flex gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            name="message"
            placeholder="Type your message..."
            className="flex-1"
            required
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting} variant="default">
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </Form>
      </div>
    </MainLayout>
  );
}
