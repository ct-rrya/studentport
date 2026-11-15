"use client";

import React, { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { CAMPUS_MAP } from "@/data/campuses";

const STORAGE_KEY = "ctu-portal-selected-campus";
const CAMPUS_EVENT = "ctu-campus-change";

interface CampusContextValue {
  selectedCampus: string;
  setSelectedCampus: (slug: string) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const CampusContext = createContext<CampusContextValue>({
  selectedCampus: "all",
  setSelectedCampus: () => {},
  chatOpen: false,
  setChatOpen: () => {},
});

function subscribeCampus(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CAMPUS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CAMPUS_EVENT, callback);
  };
}

function getCampusSnapshot(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === "all" || CAMPUS_MAP[saved])) {
      return saved;
    }
  } catch {
    // ignore storage errors in private browsing mode
  }
  return "all";
}

function getCampusServerSnapshot(): string {
  return "all";
}

// keeps the selected campus synced across pages via localStorage + shared chat drawer toggle
export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  const selectedCampus = useSyncExternalStore(
    subscribeCampus,
    getCampusSnapshot,
    getCampusServerSnapshot
  );

  const setSelectedCampus = useCallback((slug: string) => {
    const next = slug === "all" || CAMPUS_MAP[slug] ? slug : "all";
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(CAMPUS_EVENT));
    } catch {
      // no-op
    }
  }, []);

  return (
    <CampusContext.Provider value={{ selectedCampus, setSelectedCampus, chatOpen, setChatOpen }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  return useContext(CampusContext);
}
