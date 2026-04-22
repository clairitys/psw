import { create } from 'zustand';

export const useAlbumStore = create((set) => ({
  albuns: [],
  avaliacoes: [],
  artistas: [], // <-- 1. Adicionado estado de artistas

  // --- BUSCAR DADOS (READ) ---
  fetchDados: async () => {
    try {
      const [resAlbuns, resAval, resArtistas] = await Promise.all([
        fetch('http://localhost:3001/albuns'),
        fetch('http://localhost:3001/avaliacoes'),
        fetch('http://localhost:3001/artistas') // <-- 2. Buscando artistas
      ]);

      set({ 
        albuns: await resAlbuns.json(), 
        avaliacoes: await resAval.json(),
        artistas: await resArtistas.json() // <-- Atualizando estado
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  },

  // --- GESTÃO DE ÁLBUNS (CREATE / DELETE) ---
  adicionarAlbum: async (novo) => {
    const res = await fetch('http://localhost:3001/albuns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    });
    const data = await res.json();
    set((state) => ({ albuns: [...state.albuns, data] }));
  },

  removerAlbum: async (id) => {
    await fetch(`http://localhost:3001/albuns/${id}`, { method: 'DELETE' });
    set((state) => ({ albuns: state.albuns.filter(a => a.id !== id) }));
  },

  // --- GESTÃO DE ARTISTAS (CREATE) ---
  adicionarArtista: async (novo) => { // <-- 3. Função para adicionar artistas
    const res = await fetch('http://localhost:3001/artistas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    });
    const data = await res.json();
    set((state) => ({ artistas: [...state.artistas, data] }));
  },

  // --- MODERAÇÃO DE REVIEWS (DELETE) ---
  removerAvaliacao: async (id) => {
    await fetch(`http://localhost:3001/avaliacoes/${id}`, { method: 'DELETE' });
    set((state) => ({ avaliacoes: state.avaliacoes.filter(av => av.id !== id) }));
  }
}));