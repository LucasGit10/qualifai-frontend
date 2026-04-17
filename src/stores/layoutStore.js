import { create } from 'zustand';

export const useLayoutStore = create((set) => ({
  menuMobileAberto: false,
  toggleMenuMobile: () => set((state) => ({ menuMobileAberto: !state.menuMobileAberto })),
  fecharMenuMobile: () => set({ menuMobileAberto: false }),

  menuMinimizado: false,
  toggleMenuMinimizado: () => set((state) => ({ menuMinimizado: !state.menuMinimizado })),

  showCardsView: false,
  toggleViewMode: () => set((state) => ({ showCardsView: !state.showCardsView })),
  
  modalSuporteAberto: false,
  abrirModalSuporte: () => set({ modalSuporteAberto: true }),
  fecharModalSuporte: () => set({ modalSuporteAberto: false }),

  modalConversaoAberto: false,
  abrirModalConversao: () => set({ modalConversaoAberto: true }),
  fecharModalConversao: () => set({ modalConversaoAberto: false }),
}));