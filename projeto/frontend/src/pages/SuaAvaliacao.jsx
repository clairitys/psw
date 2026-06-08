import React, { useState, useEffect, useMemo } from 'react';
import { useAlbumStore } from '../store/useAlbumStore';
import { findArtistaForAlbum, getEntityId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import { maskComment } from '../utils/masks';
import { isValidRating, isValidComment } from '../utils/validators';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import './style/SuaAvaliacao.css';

export function SuaAvaliacao() {
  const { albuns, artistas, reviews, fetchAlbuns, fetchArtistas, adicionarReview } = useAlbumStore();
  const [albumSelecionado, setAlbumSelecionado] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const user = JSON.parse(localStorage.getItem('authUser'));

  useEffect(() => {
    fetchAlbuns();
    fetchArtistas();
  }, [fetchAlbuns, fetchArtistas]);

  const albunsOrdenados = useMemo(
    () =>
      [...albuns].sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR')),
    [albuns]
  );

  const albumAlvo = albumSelecionado
    ? albuns.find((a) => getEntityId(a) === String(albumSelecionado))
    : null;

  const artistaAlvo = albumAlvo
    ? albumAlvo.artistaId && typeof albumAlvo.artistaId === 'object'
      ? albumAlvo.artistaId
      : findArtistaForAlbum(artistas, albumAlvo)
    : null;

  const labelAlbum = (album) => {
    const artista = findArtistaForAlbum(artistas, album);
    return `${album.titulo} — ${artista?.nome || 'Artista desconhecido'}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!albumAlvo) {
      newErrors.album = 'Selecione um álbum na lista';
    }

    if (!isValidRating(rating)) {
      newErrors.rating = 'Selecione uma avaliação entre 1 e 5 estrelas';
    }

    if (comentario && !isValidComment(comentario)) {
      newErrors.comentario = 'Comentário não pode ter mais de 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const salvarReview = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      const novaReview = {
        album: albumAlvo.titulo,
        artist: artistaAlvo?.nome || 'Desconhecido',
        rating: rating,
        comment: comentario.trim() || '',
      };

      await adicionarReview(novaReview);

      setRating(5);
      setComentario('');
      setSuccess('Avaliação publicada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar review:', error);
      setErrors({ form: 'Erro ao publicar avaliação. Verifique sua conexão.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => (
    <div className="stars-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={star <= (hoverRating || rating) ? 'star star--active' : 'star'}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setRating(star)}
          aria-label={`${star} estrelas`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="sua-avaliacao-page">
      <Header />

      <div className="container3">
        <div className="review-card">
          {success && <div className="msg-sucesso">✓ {success}</div>}
          {errors.form && <div className="msg-erro">{errors.form}</div>}

          <div className="album-select-block">
            <label htmlFor="select-album" className="album-select-label">
              Selecionar álbum
            </label>
            <select
              id="select-album"
              className={`album-select${errors.album ? ' input-erro' : ''}`}
              value={albumSelecionado}
              onChange={(e) => {
                setAlbumSelecionado(e.target.value);
                setErrors((prev) => ({ ...prev, album: undefined }));
              }}
            >
              <option value="">— Escolha um álbum —</option>
              {albunsOrdenados.map((album) => (
                <option key={getEntityId(album)} value={getEntityId(album)}>
                  {labelAlbum(album)}
                </option>
              ))}
            </select>
            {albuns.length === 0 && (
              <p className="album-select-hint">Carregando catálogo de álbuns...</p>
            )}
            {errors.album && <span className="campo-erro">{errors.album}</span>}
          </div>

          {albumAlvo ? (
            <div className="album-header">
              <img
                src={formatCapaUrl(albumAlvo.capa)}
                alt={albumAlvo.titulo}
                className="album-cover"
                onError={(e) => {
                  e.target.src = '/img/default-album.jpg';
                }}
              />

              <div className="album-details">
                <h1 className="album-title">{albumAlvo.titulo}</h1>
                <p className="album-artist">
                  por <span className="artist-name">{artistaAlvo?.nome || 'Artista desconhecido'}</span>
                </p>

                <div className="details-grid">
                  <div className="info-column">
                    <p>Publicado: {albumAlvo.data || 'Data não informada'}</p>
                    <p>Gêneros: {albumAlvo.generos?.join(', ') || 'Não informado'}</p>
                    <div className="userspace">
                      <img src={user?.avatar || '/img/user.jpg'} className="img3" alt="User" />
                      <h2 className="usuario">{user?.username || 'usuário'}</h2>
                    </div>
                  </div>

                  <div className="info-column">
                    <div className="global-rating">
                      <span className="rating-score">⭐ Sua avaliação</span>
                    </div>
                  </div>
                </div>

                <div className="review-input-area">
                  <label className="review-label">
                    Sua Avaliação ({rating}/5 estrelas)
                  </label>
                  {renderStars()}
                  {errors.rating && <span className="campo-erro">{errors.rating}</span>}

                  <label className="review-label review-label--comentario">
                    Comentário ({comentario.length}/500)
                  </label>
                  <textarea
                    className={`comment-input${errors.comentario ? ' input-erro' : ''}`}
                    placeholder="Escreva uma avaliação (opcional)..."
                    value={comentario}
                    onChange={(e) => setComentario(maskComment(e.target.value))}
                    maxLength="500"
                    rows="4"
                  />
                  {errors.comentario && <span className="campo-erro">{errors.comentario}</span>}

                  <button
                    type="button"
                    onClick={salvarReview}
                    className="save-review-btn"
                    disabled={loading}
                  >
                    {loading ? 'Publicando...' : 'Publicar Avaliação'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="album-select-placeholder">
              Selecione um álbum acima para começar sua avaliação.
            </p>
          )}
        </div>
      </div>

      <section className="avaliações">
        <h2>Principais avaliações da semana</h2>
        <hr />
        <div className="cards">
          {Array.isArray(reviews) &&
            reviews.slice(0, 2).map((rev) => (
              <CardAvaliacao key={getEntityId(rev)} {...rev} />
            ))}
        </div>
      </section>

      <Rodape />
    </div>
  );
}
