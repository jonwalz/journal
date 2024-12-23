import { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  Save,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Alert } from "~/components/ui/alerts";
import { MainLayout } from "~/layouts/MainLayout";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";
import type { Journal } from "~/types/journal";

type ActionData =
  | { success: true; error?: never }
  | { success?: never; error: string };

type LoaderData = {
  selectedJournalId: string;
  journals: Journal[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { authToken, sessionToken } = await requireUserSession(request);
  const response = await JournalService.getJournals({
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-session-token": sessionToken,
    },
  });

  return json<LoaderData>({
    selectedJournalId: response[0]?.id || "",
    journals: response,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const { authToken, sessionToken } = await requireUserSession(request);
  const formData = await request.formData();
  const journalId = formData.get("journalId");
  const content = formData.get("content");

  if (!content || typeof content !== "string" || !content.trim()) {
    return json<ActionData>(
      { error: "Please write something before saving" },
      { status: 400 }
    );
  }

  try {
    await JournalService.createEntry(journalId as string, content, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    });
    return json<ActionData>({ success: true });
  } catch (error) {
    console.error("Failed to save entry:", error);
    return json<ActionData>(
      {
        error: error instanceof Error ? error.message : "Failed to save entry",
      },
      { status: 500 }
    );
  }
}

const TherapeuticJournalEntry = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { selectedJournalId } = useLoaderData<LoaderData>();

  const growthPrompts = [
    "What new skill or knowledge did you work on today, and what did you learn from the experience?",
    "Describe a challenge you faced today. What opportunities for growth do you see in it?",
    "What's something you initially found difficult but are getting better at? How can you see your progress?",
    "What would you like to improve or master next? What small step can you take toward that goal?",
    "How did you push outside your comfort zone today, and what did that teach you?",
  ];

  const [selectedPrompt] = useState(
    growthPrompts[Math.floor(Math.random() * growthPrompts.length)] // Grab a random prompt
  );

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <h3 className="text-xl font-heading dark:text-white text-text">
          Today&apos;s Entry
        </h3>
        <div className="flex items-center gap-2 text-sm dark:text-gray-500 text-gray-700">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>

        {/* Writing Section */}
        {showPrompt && (
          <Alert className="p-4 rounded-lg mb-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-black dark:text-white mb-1">
                Today&apos;s Prompt
              </h3>
              <p className="text-black dark:text-white">{selectedPrompt}</p>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="ml-auto text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </Alert>
        )}

        <Form method="post" className="space-y-4">
          <input type="hidden" name="journalId" value={selectedJournalId} />
          <Textarea
            name="content"
            className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
            placeholder="Write your thoughts here..."
          />

          {actionData?.error && (
            <Alert variant="destructive" className="mt-2">
              {actionData.error}
            </Alert>
          )}

          {/* Footer Tools */}
          <div className="flex justify-between items-center">
            <Button
              type="submit"
              variant="noShadow"
              className="ml-auto flex items-center gap-2 px-4 py-2 text-black dark:text-white"
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
      </div>
    </MainLayout>
  );
};

export default TherapeuticJournalEntry;
