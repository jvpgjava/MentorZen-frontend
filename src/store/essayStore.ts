import { create } from 'zustand';
import { Essay, EssayStatus } from '@/types';

interface EssayState {
  essays: Essay[];
  currentEssay: Essay | null;
  isLoading: boolean;
  error: string | null;
  setEssays: (essays: Essay[]) => void;
  addEssay: (essay: Essay) => void;
  updateEssay: (essay: Essay) => void;
  removeEssay: (id: number) => void;
  setCurrentEssay: (essay: Essay | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getEssaysByStatus: (status: EssayStatus) => Essay[];
  getDraftEssays: () => Essay[];
  getAnalyzedEssays: () => Essay[];
}

export const useEssayStore = create<EssayState>((set, get) => ({
  essays: [],
  currentEssay: null,
  isLoading: false,
  error: null,

  setEssays: (essays) => set({ essays }),

  addEssay: (essay) => set((state) => ({
    essays: [essay, ...state.essays]
  })),

  updateEssay: (updatedEssay) => set((state) => ({
    essays: state.essays.map((essay) =>
      essay.id === updatedEssay.id ? updatedEssay : essay
    ),
    currentEssay: state.currentEssay?.id === updatedEssay.id ? updatedEssay : state.currentEssay
  })),

  removeEssay: (id) => set((state) => ({
    essays: state.essays.filter((essay) => essay.id !== id),
    currentEssay: state.currentEssay?.id === id ? null : state.currentEssay
  })),

  setCurrentEssay: (essay) => set({ currentEssay: essay }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  getEssaysByStatus: (status) => {
    return get().essays.filter((essay) => essay.status === status);
  },

  getDraftEssays: () => {
    return get().essays.filter((essay) => essay.status === EssayStatus.DRAFT);
  },

  getAnalyzedEssays: () => {
    return get().essays.filter((essay) => essay.status === EssayStatus.ANALYZED);
  },
}));

