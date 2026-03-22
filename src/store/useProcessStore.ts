import { create } from "zustand";
import type { DuaDocumentStatus, ProcessEvent, SourceFile } from "@/models";

/**
 * Process store — UI state for the active DUA generation run.
 * Design pattern: Singleton (Zustand store instance)
 */
interface ProcessState {
  status: DuaDocumentStatus;
  events: ProcessEvent[];
  sourceFiles: SourceFile[];
  templateFileId: string | null;
  outputUrl: string | null;

  setStatus: (status: DuaDocumentStatus) => void;
  addEvent: (event: ProcessEvent) => void;
  setSourceFiles: (files: SourceFile[]) => void;
  setTemplateFileId: (id: string) => void;
  setOutputUrl: (url: string) => void;
  reset: () => void;
}

const initialState = {
  status: "pending" as DuaDocumentStatus,
  events: [],
  sourceFiles: [],
  templateFileId: null,
  outputUrl: null,
};

export const useProcessStore = create<ProcessState>((set) => ({
  ...initialState,
  setStatus: (status) => set({ status }),
  addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
  setSourceFiles: (files) => set({ sourceFiles: files }),
  setTemplateFileId: (id) => set({ templateFileId: id }),
  setOutputUrl: (url) => set({ outputUrl: url }),
  reset: () => set(initialState),
}));
