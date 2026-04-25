import { create } from 'zustand';

export const useAlbumStore = create((set) => ({

albuns: [],
avaliacoes: [],
artistas: [],
musicas: [], 
  fetchDados: async () => {
    try {
      const [resAlbuns, resArtistas, resMusicas] = await Promise.all([
        fetch('http://localhost:3001/albuns'),
        fetch('http://localhost:3001/artistas'),
        fetch('http://localhost:3001/musicas')
      ]);

      const dataAlbuns = await resAlbuns.json();
      console.log("Álbuns carregados:", dataAlbuns); 

      set({ 
        albuns: dataAlbuns, 
        artistas: await resArtistas.json(),
        musicas: await resMusicas.json()
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