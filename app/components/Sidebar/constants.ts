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
  LucideIcon,
} from "lucide-react";

export type JournalType = "therapeutic" | "growth" | "memory";

interface SidebarItem {
  name: string;
  icon: LucideIcon;
  href?: string;
}

interface SidebarSection {
  section: string;
  items: SidebarItem[];
}

export const sidebarOptions: Record<JournalType, SidebarSection[]> = {
  therapeutic: [
    {
      section: "Quick Access",
      items: [
        { name: "Today's Entry", icon: Book, href: "/todays-entry" },
        { name: "Emotional Check-in", icon: Heart, href: "/check-in" },
        { name: "Therapy Chat", icon: MessageCircle, href: "/chat" },
        { name: "Guided Reflection", icon: Brain, href: "/refection" },
        { name: "Mood Tracker", icon: LineChart, href: "/mood" },
      ],
    },
    {
      section: "Therapeutic Tools",
      items: [
        { name: "Coping Strategies", icon: Sparkles, href: "strategies" },
        { name: "Self-Care Checklist", icon: ListTodo, href: "checklist" },
        { name: "Pattern Recognition", icon: Tag, href: "pattern" },
        { name: "Progress Timeline", icon: Clock, href: "timeline" },
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
