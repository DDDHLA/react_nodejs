import { create } from "zustand";

interface SSEStore {
  messages: string[];
  addMessage: (msg: string) => void;
  clearMessages: () => void;
}

export const useSSEStore = create<SSEStore>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));
