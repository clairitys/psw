import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { formatCapaUrl } from '../utils/format';
import './style/Album.css';

export function Album() {
  const { id } = useParams();
  const {
    albumDetalhe,
    musicasAlbum,
    loadingDetalhe,
    error,
    fetchAlbumById,
    fetchMusicasPorAlbum,
  } = useAlbumStore();

  useEffect(() => {
    if (!id) return;
    fetchAlbumById(id).catch(() => {});
    fetchMusicasPorAlbum(id).catch(() => {});
  }, [fetchAlbumById, fetchMusicasPorAlbum, id]);

  const artistaAtual =
    albumDetalhe?.artistaId && typeof albumDetalhe.artistaId === 'object'
      ? albumDetalhe.artistaId
      : null;

  return (
    <div className="home-container">
      <Header />
      
      <div className="conteudo-principal">
        {loadingDetalhe ? (
          <div className="container3"><p>Carregando álbum...</p></div>
        ) : error ? (
          <div className="container3"><p style={{ color: '#c42a3a' }}>{error}</p></div>
        ) : albumDetalhe ? (
          <div className="container3">
            <div className="review-card">
              <div className="album-header">
                <img
                  src={formatCapaUrl(albumDetalhe.capa)}
                  alt={albumDetalhe.titulo}
                  className="album-cover"
                />
                
                <div className="album-details">
                  <div className="tabela">
                    <h1 className="album-title">{albumDetalhe.titulo}</h1>
                  </div>

                  <p className="album-artist">
                    por <Link to={`/artista/${artistaAtual?.id || artistaAtual?._id}`} className="artist-link">
                      <span className="artist-name">{artistaAtual?.nome || 'Artista desconhecido'}</span>
                    </Link>
                  </p>

                  <div className="info">
                    <p>Publicado {albumDetalhe.data || 'Não informado'}</p>
                    <p>{musicasAlbum.length} Músicas</p>
                  </div>    
                  
                  <div className="info2">
                    <p>
                      <strong>Gênero(s):</strong>{' '}
                      {Array.isArray(albumDetalhe.generos)
                        ? albumDetalhe.generos.join(', ')
                        : albumDetalhe.generos || 'Sem gênero'}
                    </p>
                    <p><strong>Gravadora:</strong> {albumDetalhe.gravadora || 'Independente'}</p>
                  </div>
                </div>
              </div>

              <div className="album">     
                {musicasAlbum.length === 0 ? (
                  <p>Este álbum ainda não tem músicas cadastradas.</p>
                ) : (
                  musicasAlbum.map((musica) => (
                    <div key={musica.id || musica._id} className="musica">
                      <span className="numero">{musica.numero}</span>
                      <span className="titulo">{musica.titulo}</span>
                      <span className="tempo">{musica.tempo}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="container3"><p>Álbum não encontrado.</p></div>
        )}
      </div>

      <Rodape />
    </div>
  );
}