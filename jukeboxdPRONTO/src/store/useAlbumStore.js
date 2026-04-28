import { create } from 'zustand';

export const useAlbumStore = create((set) => ({
  albuns: [],
  avaliacoes: [], // Armazena as avaliações vindas do db.json
  artistas: [],
  musicas: [], 

  // Função para carregar todos os dados iniciais do servidor
  fetchDados: async () => {
    try {
      const [resAlbuns, resArtistas, resMusicas, resAvaliacoes] = await Promise.all([
        fetch('http://localhost:3001/albuns'),
        fetch('http://localhost:3001/artistas'),
        fetch('http://localhost:3001/musicas'),
        fetch('http://localhost:3001/avaliacoes') // Rota para as avaliações
      ]);

      set({ 
        albuns: await resAlbuns.json(), 
        artistas: await resArtistas.json(),
        musicas: await resMusicas.json(),
        avaliacoes: await resAvaliacoes.json() // Atualiza o estado global
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

  // --- GESTÃO DE AVALIAÇÕES ---
  // Envia a nova avaliação para o banco de dados e atualiza a interface
  adicionarAvaliacao: async (novaReview) => {
    try {
      const res = await fetch('http://localhost:3001/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaReview),
      });
      const data = await res.json();
      // Adiciona a nova avaliação ao início da lista local
      set((state) => ({ avaliacoes: [data, ...state.avaliacoes] }));
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error);
    }
  },

  removerAvaliacao: async (id) => {
    try {
      await fetch(`http://localhost:3001/avaliacoes/${id}`, { method: 'DELETE' });
      set((state) => ({ 
        avaliacoes: state.avaliacoes.filter(av => av.id !== id) 
      }));
    } catch (error) {
      console.error("Erro ao remover avaliação:", error);
    }
  }
}));