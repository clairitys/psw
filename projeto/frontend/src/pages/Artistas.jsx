import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { useAlbumStore } from '../store/useAlbumStore';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './style/Artistas.css';
import { ArtistCard } from '../components/ArtistCard/ArtistCard';
import { albumMatchesArtista, getEntityId } from '../utils/ids';

export function Artistas() {
  const { artistas, albuns, fetchDados } = useAlbumStore();

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const artistasComAlbuns = artistas.map((artista) => ({
    ...artista,
    albumCount: albuns.filter((album) => albumMatchesArtista(album, getEntityId(artista))).length,
  }));
  return (
    <div className="home-container">
      <Header />
      <main className="container3 resultados-container" style={{ padding: '50px' }}>
        <h1 style={{ color: '#060d0c', textAlign: 'center' }}>Catálogo de Artistas 🎤</h1>
        <div className="artistas-grid">
          {artistasComAlbuns.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center' }}>Nenhum artista encontrado.</p>
          ) : (
            artistasComAlbuns.map(artista => (
              <ArtistCard key={artista.id} artista={artista} />
            ))
          )}
        </div>
      </main>
      <Rodape />
    </div>
  );
}