import { LucideIcon } from "lucide-react";
import { JournalType } from "./constants";

export interface JournalTypeInfo {
  id: JournalType;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface UserData {
  name: string;
  email: string;
  avatar: string;
}
