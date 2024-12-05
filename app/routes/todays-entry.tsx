import { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  Save,
  ChevronDown,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Alert } from "~/components/ui/alerts";
import { MainLayout } from "~/layouts/MainLayout";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  TypedResponse,
} from "@remix-run/node";
import { ApiClient } from "~/services/api-client";
import { JournalProvider, type Journal } from "~/context/JournalContext";
import { requireUserSession } from "~/services/session.server";

type ActionData =
  | { success: true; error?: never }
  | { success?: never; error: string };

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const content = formData.get("content");

  if (!content || typeof content !== "string" || !content.trim()) {
    return json<ActionData>(
      { error: "Please write something before saving" },
      { status: 400 }
    );
  }

  try {
    // TODO: Replace '123' with actual journalId from your app's state management
    await ApiClient.post("/123/entries", { content });
    return json<ActionData>({ success: true });
  } catch (error) {
    return json<ActionData>(
      {
        error: error instanceof Error ? error.message : "Failed to save entry",
      },
      { status: 500 }
    );
  }
}

interface LoaderData {
  journals: Journal[];
  error?: string;
}

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<LoaderData>> => {
  await requireUserSession(request);

  try {
    const response = await ApiClient.getProtected<Journal[]>(
      "/journals",
      request
    );

    return json({ journals: response.data });
  } catch (error) {
    console.error("Failed to load journals", error);
    return json(
      { journals: [], error: "Failed to load journals" },
      { status: 500 }
    );
  }
};

const TherapeuticJournalEntry = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { journals } = useLoaderData<typeof loader>();

  const therapeuticPrompts = [
    "How are you feeling today, and what might be contributing to those feelings?",
    "What's one thing that challenged you today, and how did you handle it?",
    "Reflect on a moment today when you felt strong or capable.",
    "What would you like to tell yourself right now?",
    "What are you grateful for in this moment?",
  ];

  const [selectedPrompt] = useState(therapeuticPrompts[0]);

  return (
    <JournalProvider journals={journals}>
      <MainLayout>
        <div className="container max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <h3 className="text-xl font-heading">Today&apos;s Entry</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>

          {/* Writing Section */}
          {showPrompt && (
            <Alert className="p-4 rounded-lg mb-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  Today&apos;s Prompt
                </h3>
                <p className="text-blue-800">{selectedPrompt}</p>
              </div>
              <button
                onClick={() => setShowPrompt(false)}
                className="ml-auto text-blue-600 hover:text-blue-800"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </Alert>
          )}

          <Form method="post" className="space-y-4">
            <Textarea
              name="content"
              className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your thoughts here..."
            />

            {actionData?.error && (
              <Alert variant="destructive" className="mt-2">
                {actionData.error}
              </Alert>
            )}

            {/* Footer Tools */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Tag className="w-4 h-4" />
                  <span>Add Tags</span>
                </button>
              </div>
              <Button
                type="submit"
                variant="noShadow"
                className="flex items-center gap-2 px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? "Saving..." : "Save Entry"}</span>
              </Button>
            </div>
          </Form>

          {/* AI Assistant Preview */}
          <Alert className="border rounded-lg p-4 bg-secondaryBlack">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-black dark:text-gray-500">
                AI Insights Preview
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Your AI companion will provide gentle insights and observations
              after you save your entry. These might include patterns in your
              emotions, suggested coping strategies, or prompts for deeper
              reflection.
            </p>
          </Alert>
        </div>
      </MainLayout>
    </JournalProvider>
  );
};

export default TherapeuticJournalEntry;
