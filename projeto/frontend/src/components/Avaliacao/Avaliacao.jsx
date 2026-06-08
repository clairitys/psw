import { useState, useEffect, useMemo } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import { findArtistaForAlbum, getEntityId } from '../../utils/ids';
import { formatCapaUrl } from '../../utils/format';
import { maskComment } from '../../utils/masks';
import { isValidRating, isValidComment } from '../../utils/validators';
import './Avaliacao.css';

export function Avaliacao({ aoFechar }) {
  const { albuns, artistas, fetchAlbuns, fetchArtistas, adicionarReview } = useAlbumStore();
  const [albumIdSelecionado, setAlbumIdSelecionado] = useState('');
  const [albumSelecionado, setAlbumSelecionado] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [favorito, setFavorito] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchAlbuns();
    fetchArtistas();
  }, [fetchAlbuns, fetchArtistas]);

  const albunsOrdenados = useMemo(
    () =>
      [...albuns].sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR')),
    [albuns]
  );

  const labelAlbum = (album) => {
    const artista = findArtistaForAlbum(artistas, album);
    return `${album.titulo} — ${artista?.nome || 'Artista desconhecido'}`;
  };

  const continuarComAlbum = () => {
    if (!albumIdSelecionado) {
      setErro('Selecione um álbum na lista');
      return;
    }
    const album = albuns.find((a) => getEntityId(a) === String(albumIdSelecionado));
    if (!album) {
      setErro('Álbum não encontrado');
      return;
    }
    setErro('');
    setAlbumSelecionado(album);
  };

  const lidarComSalvar = async () => {
    if (!albumSelecionado) return;

    if (!isValidRating(nota)) {
      setErro('Selecione uma avaliação entre 1 e 5 estrelas');
      return;
    }

    if (comentario && !isValidComment(comentario)) {
      setErro('Comentário não pode ter mais de 500 caracteres');
      return;
    }

    const artistaInfo = findArtistaForAlbum(artistas, albumSelecionado);

    setLoading(true);
    setErro('');

    try {
      await adicionarReview({
        album: albumSelecionado.titulo,
        artist: artistaInfo?.nome || 'Desconhecido',
        rating: nota,
        comment: comentario.trim(),
      });

      setFeedback(true);
      setTimeout(() => aoFechar(), 2000);
    } catch (error) {
      setErro(error.message || 'Erro ao salvar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {feedback ? (
          <div className="tela-feedback">
            <div className="feedback-content">
              <div className="check-icon">✓</div>
              <p>Avaliação salva em seu perfil</p>
            </div>
          </div>
        ) : (
          <>
            {!albumSelecionado ? (
              <div className="tela-log">
                <div className="modal-header">
                  <span>Avaliar</span>
                  <button type="button" className="close-x" onClick={aoFechar}>
                    ×
                  </button>
                </div>
                <div className="busca-corpo">
                  <label htmlFor="avaliacao-select-album" className="album-select-label">
                    Selecionar álbum
                  </label>
                  <select
                    id="avaliacao-select-album"
                    className="album-select-modal"
                    autoFocus
                    value={albumIdSelecionado}
                    onChange={(e) => {
                      setAlbumIdSelecionado(e.target.value);
                      setErro('');
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
                    <p className="album-select-hint-modal">Carregando álbuns...</p>
                  )}

                  {erro && <p className="erro-modal">{erro}</p>}

                  <button type="button" className="btn-continuar-album" onClick={continuarComAlbum}>
                    Continuar
                  </button>
                </div>
              </div>
            ) : (
              <div className="tela-form">
                <div
                  className="fundo-blur"
                  style={{ backgroundImage: `url(${formatCapaUrl(albumSelecionado.capa)})` }}
                />
                <div className="form-conteudo">
                  <div className="form-header">
                    <button
                      type="button"
                      className="btn-voltar"
                      onClick={() => {
                        setAlbumSelecionado(null);
                        setNota(0);
                        setComentario('');
                        setErro('');
                      }}
                    >
                      ⭠
                    </button>
                    <button type="button" className="btn-fechar" onClick={aoFechar}>
                      ×
                    </button>
                  </div>

                  <div className="form-grid">
                    <img
                      src={formatCapaUrl(albumSelecionado.capa)}
                      className="capa-grande"
                      alt="Capa"
                    />

                    <div className="form-inputs">
                      <h2>
                        {albumSelecionado.titulo}{' '}
                        <small>
                          {albumSelecionado.data?.split?.(',')?.[1]?.trim() || ''}
                        </small>
                      </h2>

                      <span className="artista-destaque">
                        {findArtistaForAlbum(artistas, albumSelecionado)?.nome ||
                          'Artista desconhecido'}
                      </span>

                      <div className="opcoes-rapidas">
                        <label>
                          <input type="checkbox" readOnly tabIndex={-1} /> Ouvi em{' '}
                          {new Date().toLocaleDateString()}
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={favorito}
                            onChange={() => setFavorito(!favorito)}
                          />{' '}
                          Curtir
                        </label>
                      </div>

                      <textarea
                        placeholder="Adicionar avaliação..."
                        value={comentario}
                        onChange={(e) => setComentario(maskComment(e.target.value))}
                        maxLength={500}
                      />

                      <div className="rating-footer">
                        <div className="star-box">
                          <label>Avaliação</label>
                          <div className="estrelas">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                role="button"
                                tabIndex={0}
                                onClick={() => setNota(n)}
                                onKeyDown={(e) => e.key === 'Enter' && setNota(n)}
                                className={n <= nota ? 'active' : ''}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {erro && <p className="erro-modal">{erro}</p>}

                      <button
                        type="button"
                        className="save-btn"
                        onClick={lidarComSalvar}
                        disabled={loading || nota < 1}
                      >
                        {loading ? 'salvando...' : 'salvar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
