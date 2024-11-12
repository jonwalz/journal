import { useState } from "react";
import {
  Moon,
  Brain,
  Battery,
  Users,
  Heart,
  Activity,
  Coffee,
  Cloud,
  Home,
  Building2,
  Smartphone,
  Save,
  Check,
  Target,
} from "lucide-react";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";

const factorCategories = [
  {
    id: "wellness",
    label: "Physical Wellness",
    factors: [
      {
        id: "sleep",
        icon: Moon,
        label: "Sleep Quality",
        description: "How well did you sleep last night?",
      },
      {
        id: "energy",
        icon: Battery,
        label: "Energy Level",
        description: "How energetic do you feel?",
      },
      {
        id: "exercise",
        icon: Activity,
        label: "Physical Activity",
        description: "How active have you been?",
      },
      {
        id: "nutrition",
        icon: Coffee,
        label: "Nutrition",
        description: "How well are you eating?",
      },
      {
        id: "medication",
        icon: Check,
        label: "Medication Adherence",
        description: "Have you taken prescribed medications?",
      },
    ],
  },
  {
    id: "mental",
    label: "Mental State",
    factors: [
      {
        id: "anxiety",
        icon: Cloud,
        label: "Anxiety Level",
        description: "How anxious do you feel?",
      },
      {
        id: "focus",
        icon: Brain,
        label: "Mental Clarity",
        description: "How clear and focused is your mind?",
      },
      {
        id: "overwhelm",
        icon: Cloud,
        label: "Overwhelm",
        description: "How overwhelmed do you feel?",
      },
      {
        id: "motivation",
        icon: Target,
        label: "Motivation",
        description: "How motivated do you feel?",
      },
    ],
  },
  {
    id: "social",
    label: "Social & Environment",
    factors: [
      {
        id: "social",
        icon: Users,
        label: "Social Connection",
        description: "How connected do you feel to others?",
      },
      {
        id: "family",
        icon: Heart,
        label: "Family Relations",
        description: "How are your family interactions?",
      },
      {
        id: "work",
        icon: Building2,
        label: "Work/School Stress",
        description: "How is your work/school environment?",
      },
      {
        id: "environment",
        icon: Home,
        label: "Home Environment",
        description: "How comfortable is your environment?",
      },
    ],
  },
  {
    id: "coping",
    label: "Coping & Habits",
    factors: [
      {
        id: "screenTime",
        icon: Smartphone,
        label: "Screen Time",
        description: "How much screen time today?",
      },
      {
        id: "selfCare",
        icon: Heart,
        label: "Self-Care",
        description: "How well are you taking care of yourself?",
      },
      {
        id: "stress",
        icon: Brain,
        label: "Stress Management",
        description: "How well are you managing stress?",
      },
      {
        id: "copingSkills",
        icon: Target,
        label: "Coping Skills Use",
        description: "Are you using healthy coping skills?",
      },
    ],
  },
];

type FactorValues = {
  [key: string]: number;
};

const initialState: FactorValues = {
  // Physical Wellness
  sleep: 5,
  energy: 5,
  exercise: 5,
  nutrition: 5,
  medication: 5,

  // Mental State
  anxiety: 5,
  focus: 5,
  overwhelm: 5,
  motivation: 5,

  // Social & Environment
  social: 5,
  family: 5,
  work: 5,
  environment: 5,

  // Coping & Habits
  screenTime: 5,
  selfCare: 5,
  stress: 5,
  copingSkills: 5,
};

const EmotionalCheckin = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "wellness"
  );
  const [factorValues, setFactorValues] = useState<FactorValues>(initialState);

  const handleFactorChange = (factorId: string, value: number[]) => {
    setFactorValues((prev) => ({
      ...prev,
      [factorId]: value[0],
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Time Selection */}
      <h3 className="text-xl font-heading">Daily Check-in</h3>
      <p className="text-slate-600">Track factors affecting your well-being</p>

      {/* Factors by Category */}
      {factorCategories.map((category) => (
        <div
          key={category.id}
          className="bg-secondaryBlack p-6 rounded-xl border border-slate-200 shadow-sm rounded"
        >
          <button
            onClick={() =>
              setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )
            }
            className="w-full flex justify-between items-center mb-4"
          >
            <h2 className="text-lg font-semibold">{category.label}</h2>
            <span className="text-slate-400">
              {expandedCategory === category.id ? "−" : "+"}
            </span>
          </button>

          {expandedCategory === category.id && (
            <div className="space-y-6">
              {category.factors.map((factor) => (
                <div key={factor.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <factor.icon size={20} className="text-slate-600" />
                      <label
                        htmlFor={factor.id}
                        className="text-slate-700 font-medium"
                      >
                        {factor.label}
                      </label>
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {factorValues[factor.id]}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id={factor.id}
                      step={1}
                      max={10}
                      defaultValue={[factorValues[factor.id]]}
                      value={[factorValues[factor.id]]}
                      onValueChange={(value) =>
                        handleFactorChange(factor.id, value)
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-slate-500">{factor.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Optional Note */}
      <div className="bg-secondaryBlack p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
        <Textarea
          className="dark:border-slate-200 w-full h-24 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:italic"
          placeholder="Any additional thoughts or context about your day..."
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Save size={20} />
          <span>Save Check-in</span>
        </button>
      </div>
    </div>
  );
};

export default EmotionalCheckin;
