import {
  Book,
  Clock,
  Tag,
  ListTodo,
  MessageCircle,
  Sparkles,
  Heart,
  Brain,
  Target,
  LineChart,
  BookOpen,
  Star,
  ClipboardList,
} from "lucide-react";

export const sidebarOptions = {
  therapeutic: [
    {
      section: "QUICK ACCESS",
      items: [
        { name: "Today's Entry", icon: Book },
        { name: "Emotional Check-in", icon: Heart },
        { name: "Therapy Chat", icon: MessageCircle },
        { name: "Guided Reflection", icon: Brain },
        { name: "Mood Tracker", icon: LineChart },
      ],
    },
    {
      section: "THERAPEUTIC TOOLS",
      items: [
        { name: "Coping Strategies", icon: Sparkles },
        { name: "Self-Care Checklist", icon: ListTodo },
        { name: "Pattern Recognition", icon: Tag },
        { name: "Progress Timeline", icon: Clock },
      ],
    },
  ],
  growth: [
    {
      section: "QUICK ACCESS",
      items: [
        { name: "Today's Entry", icon: Book },
        { name: "Goal Tracking", icon: Target },
        { name: "Growth Chat", icon: MessageCircle },
        { name: "Action Items", icon: ListTodo },
        { name: "Progress Dashboard", icon: LineChart },
      ],
    },
    {
      section: "GROWTH TOOLS",
      items: [
        { name: "Milestone Tracker", icon: Clock },
        { name: "Action Plans", icon: ClipboardList },
        { name: "Success Stories", icon: Star },
        { name: "Habit Builder", icon: Target },
      ],
    },
  ],
  memory: [
    {
      section: "QUICK ACCESS",
      items: [
        { name: "Today's Memory", icon: Book },
        { name: "Memory Chat", icon: MessageCircle },
        { name: "Time Capsule", icon: Clock },
        { name: "Memory Map", icon: LineChart },
      ],
    },
    {
      section: "MEMORY TOOLS",
      items: [
        { name: "Timeline View", icon: Clock },
        { name: "Tags & Topics", icon: Tag },
        { name: "Highlights", icon: Star },
        { name: "Photo Journal", icon: BookOpen },
      ],
    },
  ],
};
