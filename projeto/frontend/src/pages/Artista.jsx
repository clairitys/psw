import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { AlbumCard } from '../components/AlbumCard/AlbumCard';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import { formatAvatarUrl } from '../utils/format';
import './style/Artista.css';

export function Artista() {
  const { id } = useParams();
  const {
    artistaDetalhe,
    albunsArtista,
    reviewsArtista,
    loadingDetalhe,
    error,
    fetchArtistaById,
    fetchAlbunsPorArtista,
    fetchReviewsPorArtista,
  } = useAlbumStore();

  useEffect(() => {
    if (!id) return;
    fetchArtistaById(id).catch(() => {});
  }, [fetchArtistaById, id]);

  useEffect(() => {
    if (!id) return;
    fetchAlbunsPorArtista(id).catch(() => {});
  }, [fetchAlbunsPorArtista, id]);

  useEffect(() => {
    if (artistaDetalhe?.nome) {
      fetchReviewsPorArtista(artistaDetalhe.nome).catch(() => {});
    }
  }, [artistaDetalhe?.nome, fetchReviewsPorArtista]);

  return (
    <div className="home-container">
      <Header />
      <main className="container3">
        {loadingDetalhe ? (
          <p>Carregando artista...</p>
        ) : error ? (
          <p style={{ color: '#c42a3a' }}>{error}</p>
        ) : artistaDetalhe ? (
          <section className="artist-detail-page">
            <div className="artist-header">
              <div className="artist-image-wrapper">
                <img
                  src={formatAvatarUrl(artistaDetalhe.foto, '/img/user.jpg')}
                  alt={artistaDetalhe.nome}
                  className="artist-detail-image"
                />
              </div>
              <div className="artist-info">
                <h1>{artistaDetalhe.nome}</h1>
                <p>{artistaDetalhe.bio || 'Biografia não disponível.'}</p>
              </div>
            </div>

            <div className="artist-albums">
              <h2>Álbuns do artista</h2>
              {albunsArtista.length === 0 ? (
                <p>Não há álbuns cadastrados para este artista.</p>
              ) : (
                <div className="artist-albums-grid">
                  {albunsArtista.map((album) => (
                    <AlbumCard key={album.id || album._id} album={album} />
                  ))}
                </div>
              )}
            </div>

            <section id="artist-reviews-section" className="artist-reviews">
              <h2>Avaliações do artista</h2>
              {reviewsArtista.length === 0 ? (
                <p>Sem avaliações cadastradas para este artista.</p>
              ) : (
                <div className="reviews-list">
                  {reviewsArtista.map((review) => (
                    <CardAvaliacao key={review.id || review._id} {...review} />
                  ))}
                </div>
              )}
            </section>
          </section>
        ) : (
          <p>Artista não encontrado.</p>
        )}
      </main>
      <Rodape />
    </div>
  );
}
