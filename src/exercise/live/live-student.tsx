import { createContext, useContext, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import type { LiveSessionJoin } from "./api";

// Holds the student's live-session identity (session + participant keys)
// across the join -> runner navigation, in memory only
// (no localStorage). A page refresh drops it, so the runner sends the student
// back to the join screen to re-join.
interface LiveStudentContextValue {
  join: LiveSessionJoin | null;
  setJoin: (join: LiveSessionJoin | null) => void;
}

const LiveStudentContext = createContext<LiveStudentContextValue | null>(null);

export function LiveStudentProvider() {
  const [join, setJoin] = useState<LiveSessionJoin | null>(null);
  const value = useMemo(() => ({ join, setJoin }), [join]);
  return (
    <LiveStudentContext.Provider value={value}>
      <Outlet />
    </LiveStudentContext.Provider>
  );
}

export function useLiveStudent(): LiveStudentContextValue {
  const ctx = useContext(LiveStudentContext);
  if (!ctx) {
    throw new Error("useLiveStudent must be used within a LiveStudentProvider");
  }
  return ctx;
}
