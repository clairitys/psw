import { create } from 'zustand';

export const useAlbumStore = create((set) => ({
  albuns: [],
  avaliacoes: [], // Agora será populado pelo fetch
  artistas: [],
  musicas: [], 

  fetchDados: async () => {
    try {
      // Atualizado para incluir a busca de avaliações simultaneamente
      const [resAlbuns, resArtistas, resMusicas, resAvaliacoes] = await Promise.all([
        fetch('http://localhost:3001/albuns'),
        fetch('http://localhost:3001/artistas'),
        fetch('http://localhost:3001/musicas'),
        fetch('http://localhost:3001/avaliacoes') // Nova rota no db.json
      ]);

      set({ 
        albuns: await resAlbuns.json(), 
        artistas: await resArtistas.json(),
        musicas: await resMusicas.json(),
        avaliacoes: await resAvaliacoes.json() // Armazena as avaliações no estado global
      });
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    }
  },

  // --- GESTÃO DE ÁLBUNS ---
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

  // --- GESTÃO DE ARTISTAS ---
  adicionarArtista: async (novo) => {
    const res = await fetch('http://localhost:3001/artistas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    });
    const data = await res.json();
    set((state) => ({ artistas: [...state.artistas, data] }));
  },

  // --- GESTÃO DE AVALIAÇÕES (NOVO) ---
  // Função para o usuário enviar um comentário do site para o banco
  adicionarAvaliacao: async (novaReview) => {
    const res = await fetch('http://localhost:3001/avaliacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaReview),
    });
    const data = await res.json();
    set((state) => ({ avaliacoes: [...state.avaliacoes, data] }));
  },

  removerAvaliacao: async (id) => {
    await fetch(`http://localhost:3001/avaliacoes/${id}`, { method: 'DELETE' });
    set((state) => ({ avaliacoes: state.avaliacoes.filter(av => av.id !== id) }));
  }
}));