import { createContext, useContext, ReactNode, useState } from "react";

export interface Journal {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalContextType {
  selectedJournalId: number | null;
  setSelectedJournalId: (id: number | null) => void;
  journals: Journal[];
}

export const JournalContext = createContext<JournalContextType | undefined>(
  undefined
);

export function JournalProvider({
  journals,
  children,
}: {
  children: ReactNode;
  journals: Journal[];
}) {
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(
    journals[0]?.id
  );

  return (
    <JournalContext.Provider
      value={{ selectedJournalId, setSelectedJournalId, journals }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
}
