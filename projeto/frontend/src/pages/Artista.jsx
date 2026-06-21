import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
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

  // Garante valores padrão seguros em arrays para evitar ecrã em branco por dados ausentes
  const listaAlbuns = albunsArtista || [];
  const listaReviews = reviewsArtista || [];

  return (
    <div className="home-container">
      <Header />
      
      <main className="container3">
        {loadingDetalhe ? (
          <p className="subtitulo" style={{ textAlign: 'center', padding: '40px' }}>Carregando artista...</p>
        ) : error ? (
          <p style={{ color: '#c42a3a', textAlign: 'center', padding: '40px' }}>{error}</p>
        ) : artistaDetalhe ? (
          <section className="artist-detail-page">
            
            {/* SEÇÃO DO PERFIL DO ARTISTA */}
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
                <div className="biografia">
                  <span>sobre o artista ✭</span>
                  <p>{artistaDetalhe.bio || 'Biografia não disponível.'}</p>
                </div>
              </div>
            </div>

            {/* SEÇÃO DOS ÁLBUNS (APENAS AS CAPAS - EM GRID HORIZONTAL) */}
            <div className="artist-albums">
              <h2>Álbuns do artista</h2>
              {listaAlbuns.length === 0 ? (
                <p className="subtitulo">Não há álbuns cadastrados para este artista.</p>
              ) : (
                <div className="albuns">
                  {listaAlbuns.map((album) => (
                    <Link to={`/album/${album.id || album._id}`} key={album.id || album._id}>
                      <img 
                        src={album.capa ? (album.capa.startsWith('http') || album.capa.startsWith('/') ? album.capa : `/${album.capa}`) : '/img/default-album.jpg'} 
                        alt={album.titulo} 
                        className="img3"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SEÇÃO DAS AVALIAÇÕES */}
            <section id="artist-reviews-section" className="artist-reviews">
              <h2>Avaliações do artista</h2>
              {listaReviews.length === 0 ? (
                <p className="subtitulo">Sem avaliações cadastradas para este artista.</p>
              ) : (
                <div className="cards">
                  {listaReviews.map((review) => (
                    <CardAvaliacao key={review.id || review._id} {...review} />
                  ))}
                </div>
              )}
            </section>

          </section>
        ) : (
          <p className="subtitulo" style={{ textAlign: 'center', padding: '40px' }}>Artista não encontrado.</p>
        )}
      </main>
      
      <Rodape />
    </div>
  );
}