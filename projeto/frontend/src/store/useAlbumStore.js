import { create } from 'zustand';
import { getEntityId, albumMatchesArtista } from '../utils/ids';

const API_BASE_URL = '/api';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const normalizeItem = (item) => {
  if (!item || typeof item !== 'object') return item;
  const id = getEntityId(item);
  const normalized = { ...item, id };

  if (item.artistaId && typeof item.artistaId === 'object') {
    normalized.artistaId = {
      ...item.artistaId,
      id: getEntityId(item.artistaId),
    };
  }

  if (item.albumId && typeof item.albumId === 'object') {
    normalized.albumId = {
      ...item.albumId,
      id: getEntityId(item.albumId),
    };
  }

  if (item.user && typeof item.user === 'object') {
    normalized.user = {
      ...item.user,
      id: getEntityId(item.user),
    };
  }

  return normalized;
};

const normalizeList = (list) => (Array.isArray(list) ? list.map(normalizeItem) : []);

const parseError = async (res, fallback) => {
  try {
    const data = await res.json();
    if (data.errors?.length) return data.errors[0]?.msg || fallback;
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

export const useAlbumStore = create((set, get) => ({
  albuns: [],
  reviews: [],
  musicas: [],
  listas: [],
  artistas: [],
  generos: [],
  albumDetalhe: null,
  artistaDetalhe: null,
  musicasAlbum: [],
  albunsArtista: [],
  reviewsArtista: [],
  loading: false,
  loadingDetalhe: false,
  error: null,

  clearDetalhe: () =>
    set({
      albumDetalhe: null,
      artistaDetalhe: null,
      musicasAlbum: [],
      albunsArtista: [],
      reviewsArtista: [],
      loadingDetalhe: false,
    }),

  fetchDados: async () => {
    set({ loading: true, error: null });
    try {
      const [resAlbuns, resArtistas, resReviews, resMusicas, resListas, resGeneros] = await Promise.all([
        fetch(`${API_BASE_URL}/albuns`),
        fetch(`${API_BASE_URL}/artistas`),
        fetch(`${API_BASE_URL}/reviews`),
        fetch(`${API_BASE_URL}/musicas`),
        fetch(`${API_BASE_URL}/listas`),
        fetch(`${API_BASE_URL}/generos`),
      ]);

      if (!resAlbuns.ok || !resArtistas.ok || !resReviews.ok || !resMusicas.ok || !resListas.ok || !resGeneros.ok) {
        throw new Error('Erro ao carregar dados do servidor');
      }

      set({
        albuns: normalizeList(await resAlbuns.json()),
        artistas: normalizeList(await resArtistas.json()),
        reviews: normalizeList(await resReviews.json()),
        musicas: normalizeList(await resMusicas.json()),
        listas: normalizeList(await resListas.json()),
        generos: normalizeList(await resGeneros.json()),
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do servidor:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchAlbuns: async () => {
    if (get().albuns.length > 0) return get().albuns;
    try {
      const res = await fetch(`${API_BASE_URL}/albuns`);
      if (!res.ok) throw new Error('Erro ao buscar álbuns');
      const albuns = normalizeList(await res.json());
      set({ albuns, error: null });
      return albuns;
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      set({ error: error.message });
      throw error;
    }
  },

  fetchGeneros: async () => {
    if (get().generos.length > 0) return get().generos;
    try {
      const res = await fetch(`${API_BASE_URL}/generos`);
      if (!res.ok) throw new Error('Erro ao buscar gêneros');
      const generos = normalizeList(await res.json());
      set({ generos, error: null });
      return generos;
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      set({ error: error.message });
      throw error;
    }
  },

  fetchArtistas: async () => {
    if (get().artistas.length > 0) return get().artistas;
    try {
      const res = await fetch(`${API_BASE_URL}/artistas`);
      if (!res.ok) throw new Error('Erro ao buscar artistas');
      const artistas = normalizeList(await res.json());
      set({ artistas, error: null });
      return artistas;
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
      set({ error: error.message });
      throw error;
    }
  },

  fetchAlbumById: async (id) => {
    set({ loadingDetalhe: true, error: null, albumDetalhe: null });
    try {
      const res = await fetch(`${API_BASE_URL}/albuns/${id}`);
      if (!res.ok) {
        throw new Error(await parseError(res, 'Álbum não encontrado'));
      }
      const albumDetalhe = normalizeItem(await res.json());
      set({ albumDetalhe, loadingDetalhe: false });
      return albumDetalhe;
    } catch (error) {
      console.error('Erro ao buscar álbum:', error);
      set({ albumDetalhe: null, error: error.message, loadingDetalhe: false });
      throw error;
    }
  },

  fetchArtistaById: async (id) => {
    set({ loadingDetalhe: true, error: null, artistaDetalhe: null });
    try {
      const res = await fetch(`${API_BASE_URL}/artistas/${id}`);
      if (!res.ok) {
        throw new Error(await parseError(res, 'Artista não encontrado'));
      }
      const artistaDetalhe = normalizeItem(await res.json());
      set({ artistaDetalhe, loadingDetalhe: false });
      return artistaDetalhe;
    } catch (error) {
      console.error('Erro ao buscar artista:', error);
      set({ artistaDetalhe: null, error: error.message, loadingDetalhe: false });
      throw error;
    }
  },

  fetchMusicasPorAlbum: async (albumId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/musicas`);
      if (!res.ok) throw new Error('Erro ao buscar músicas');
      const musicas = normalizeList(await res.json());
      const musicasAlbum = musicas
        .filter((m) => getEntityId(m.albumId) === String(albumId))
        .sort((a, b) => (a.numero || 0) - (b.numero || 0));
      set({ musicasAlbum, error: null });
      return musicasAlbum;
    } catch (error) {
      console.error('Erro ao buscar músicas do álbum:', error);
      set({ musicasAlbum: [], error: error.message });
      throw error;
    }
  },

  fetchAlbunsPorArtista: async (artistaId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns`);
      if (!res.ok) throw new Error('Erro ao buscar álbuns');
      const albunsArtista = normalizeList(await res.json()).filter((a) =>
        albumMatchesArtista(a, artistaId)
      );
      set({ albunsArtista, error: null });
      return albunsArtista;
    } catch (error) {
      console.error('Erro ao buscar álbuns do artista:', error);
      set({ albunsArtista: [], error: error.message });
      throw error;
    }
  },

  fetchReviewsPorArtista: async (nomeArtista) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`);
      if (!res.ok) throw new Error('Erro ao buscar avaliações');
      const nome = nomeArtista?.toLowerCase() || '';
      const reviewsArtista = normalizeList(await res.json()).filter(
        (r) => r.artist?.toLowerCase() === nome
      );
      set({ reviewsArtista, error: null });
      return reviewsArtista;
    } catch (error) {
      console.error('Erro ao buscar avaliações do artista:', error);
      set({ reviewsArtista: [], error: error.message });
      throw error;
    }
  },

  fetchReviewById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`);
      if (!res.ok) throw new Error(await parseError(res, 'Avaliação não encontrada'));
      return normalizeItem(await res.json());
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarAlbum: async (novo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novo),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao adicionar álbum'));
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ albuns: [...state.albuns, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao adicionar álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removerAlbum: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao remover álbum'));
      }

      set((state) => ({
        albuns: state.albuns.filter((a) => getEntityId(a) !== String(id)),
        albunsArtista: state.albunsArtista.filter((a) => getEntityId(a) !== String(id)),
        albumDetalhe:
          state.albumDetalhe && getEntityId(state.albumDetalhe) === String(id)
            ? null
            : state.albumDetalhe,
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao remover álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  atualizarAlbum: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/albuns/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao atualizar álbum'));
      }

      const data = normalizeItem(await res.json());
      set((state) => ({
        albuns: state.albuns.map((a) => (getEntityId(a) === String(id) ? data : a)),
        albunsArtista: state.albunsArtista.map((a) =>
          getEntityId(a) === String(id) ? data : a
        ),
        albumDetalhe:
          state.albumDetalhe && getEntityId(state.albumDetalhe) === String(id)
            ? data
            : state.albumDetalhe,
        error: null,
      }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar álbum:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarArtista: async (novo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/artistas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novo),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao adicionar artista'));
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ artistas: [...state.artistas, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao adicionar artista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  atualizarArtista: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/artistas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao atualizar artista'));
      }

      const data = normalizeItem(await res.json());
      set((state) => ({
        artistas: state.artistas.map((a) => (getEntityId(a) === String(id) ? data : a)),
        artistaDetalhe:
          state.artistaDetalhe && getEntityId(state.artistaDetalhe) === String(id)
            ? data
            : state.artistaDetalhe,
        error: null,
      }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar artista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removerArtista: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/artistas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao remover artista'));
      }

      set((state) => ({
        artistas: state.artistas.filter((a) => getEntityId(a) !== String(id)),
        artistaDetalhe:
          state.artistaDetalhe && getEntityId(state.artistaDetalhe) === String(id)
            ? null
            : state.artistaDetalhe,
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao remover artista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarMusica: async (nova) => {
    try {
      const res = await fetch(`${API_BASE_URL}/musicas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(nova),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao adicionar música'));
      }

      const data = normalizeItem(await res.json());
      const albumId = getEntityId(data.albumId);
      set((state) => {
        const musicas = [...state.musicas, data];
        const musicasAlbum =
          state.albumDetalhe && getEntityId(state.albumDetalhe) === albumId
            ? [...state.musicasAlbum, data].sort((a, b) => (a.numero || 0) - (b.numero || 0))
            : state.musicasAlbum;
        return { musicas, musicasAlbum, error: null };
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      set({ error: error.message });
      throw error;
    }
  },

  atualizarMusica: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/musicas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao atualizar música'));
      }

      const data = normalizeItem(await res.json());
      const patch = (list) => list.map((m) => (getEntityId(m) === String(id) ? data : m));
      set((state) => ({
        musicas: patch(state.musicas),
        musicasAlbum: patch(state.musicasAlbum).sort((a, b) => (a.numero || 0) - (b.numero || 0)),
        error: null,
      }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar música:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removerMusica: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/musicas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao remover música'));
      }

      set((state) => ({
        musicas: state.musicas.filter((m) => getEntityId(m) !== String(id)),
        musicasAlbum: state.musicasAlbum.filter((m) => getEntityId(m) !== String(id)),
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao remover música:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarLista: async (novaLista) => {
    try {
      const isFormData = novaLista instanceof FormData;
      const res = await fetch(`${API_BASE_URL}/listas`, {
        method: 'POST',
        headers: getAuthHeaders(isFormData),
        body: isFormData ? novaLista : JSON.stringify(novaLista),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao criar lista'));
      }

      const data = normalizeItem(await res.json());
      set((state) => ({ listas: [...state.listas, data], error: null }));
      return data;
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      set({ error: error.message });
      throw error;
    }
  },

  adicionarReview: async (novaReview) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(novaReview),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao adicionar avaliação'));
      }

      const data = normalizeItem(await res.json());
      set((state) => {
        const nome = data.artist?.toLowerCase() || '';
        const incluirNoArtista =
          state.artistaDetalhe &&
          state.artistaDetalhe.nome?.toLowerCase() === nome;
        return {
          reviews: [data, ...state.reviews],
          reviewsArtista: incluirNoArtista ? [data, ...state.reviewsArtista] : state.reviewsArtista,
          error: null,
        };
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  atualizarReview: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao atualizar avaliação'));
      }

      const data = normalizeItem(await res.json());
      const patch = (list) => list.map((r) => (getEntityId(r) === String(id) ? data : r));
      set((state) => ({
        reviews: patch(state.reviews),
        reviewsArtista: patch(state.reviewsArtista),
        error: null,
      }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removerReview: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await parseError(res, 'Erro ao remover avaliação'));
      }

      set((state) => ({
        reviews: state.reviews.filter((r) => getEntityId(r) !== String(id)),
        reviewsArtista: state.reviewsArtista.filter((r) => getEntityId(r) !== String(id)),
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao remover avaliação:', error);
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
}));
