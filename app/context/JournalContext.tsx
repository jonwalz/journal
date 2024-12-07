import { createContext, useContext, ReactNode, useState } from "react";
import { Journal, JournalContextType } from "~/types/journal";

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
  const [selectedJournalId, setSelectedJournalId] = useState<string>(
    journals[0]?.id ?? ""
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
