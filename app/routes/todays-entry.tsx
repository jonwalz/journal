import { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  Save,
  ChevronDown,
  Tag,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Alert } from "~/components/ui/alerts";

const TherapeuticJournalEntry = () => {
  const [mood, setMood] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);

  const moodOptions = [
    { emoji: "😊", label: "Happy", color: "bg-green-100 hover:bg-green-200" },
    { emoji: "😌", label: "Calm", color: "bg-blue-100 hover:bg-blue-200" },
    { emoji: "😔", label: "Sad", color: "bg-indigo-100 hover:bg-indigo-200" },
    { emoji: "😠", label: "Angry", color: "bg-red-100 hover:bg-red-200" },
    {
      emoji: "😟",
      label: "Anxious",
      color: "bg-yellow-100 hover:bg-yellow-200",
    },
    { emoji: "😐", label: "Neutral", color: "bg-gray-100 hover:bg-gray-200" },
  ];

  const therapeuticPrompts = [
    "How are you feeling today, and what might be contributing to those feelings?",
    "What's one thing that challenged you today, and how did you handle it?",
    "Reflect on a moment today when you felt strong or capable.",
    "What would you like to tell yourself right now?",
    "What are you grateful for in this moment?",
  ];

  const [selectedPrompt] = useState(therapeuticPrompts[0]);

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <h3 className="text-xl font-heading">Today&apos;s Entry</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>{new Date().toLocaleDateString()}</span>
        <Clock className="w-4 h-4 ml-2" />
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
      {/* Mood Selector */}
      <h3 className="text-white text-xl">How are you feeling?</h3>
      <div className="flex justify-between">
        {moodOptions.map((option) => (
          <Button
            key={option.label}
            onClick={() => setMood(option.label)}
            className={`rounded-full flex items-center gap-2 transition-colors ${
              option.color
            } ${mood === option.label ? "ring-2 ring-blue-500" : ""}`}
          >
            <span className="text-xl">{option.emoji}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </Button>
        ))}
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
      <Textarea className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

      {/* Footer Tools */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Tag className="w-4 h-4" />
            <span>Add Tags</span>
          </button>
        </div>
        <Button
          variant="noShadow"
          className="flex items-center gap-2 px-4 py-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Entry</span>
        </Button>
      </div>

      {/* AI Assistant Preview */}
      <Alert className="border rounded-lg p-4 bg-secondaryBlack">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-black dark:text-gray-500">
            AI Insights Preview
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Your AI companion will provide gentle insights and observations after
          you save your entry. These might include patterns in your emotions,
          suggested coping strategies, or prompts for deeper reflection.
        </p>
      </Alert>
    </div>
  );
};

export default TherapeuticJournalEntry;
