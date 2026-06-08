import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { useAlbumStore } from '../store/useAlbumStore';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './style/PagArtistas.css';
import { albumMatchesArtista, getEntityId } from '../utils/ids';

export function PagArtistas() {
  const { artistas, albuns, fetchDados } = useAlbumStore();

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const artistasComAlbuns = artistas.map((artista) => ({
    ...artista,
    albumCount: albuns.filter((album) => albumMatchesArtista(album, getEntityId(artista))).length,
  }));

  return (
    <div className="artistas-page-wrapper">
      <Header />
      
      {/* CONTEÚDO PRINCIPAL CONFIGURADO EM ESTILO JOURNAL */}
      <main className="artistas-main-content">
        <h1>Catálogo de Artistas</h1>
        <hr className="artistas-hr-divider" />

        {artistasComAlbuns.length === 0 ? (
          <div className="artistas-grid">
            <p className="artistas-vazio">Nenhum artista encontrado no catálogo.</p>
          </div>
        ) : (
          <div className="artistas-grid">
            {artistasComAlbuns.map((artista) => (
              <Link 
                to={`/artista/${getEntityId(artista)}`} 
                key={getEntityId(artista)} 
                className="artista-journal-card"
              >
                {/* Box da Imagem do Artista */}
                <div className="artista-card-image-box">
                  <img 
                    src={artista.imagemUrl || "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=600&auto=format&fit=crop"} 
                    alt={artista.nome} 
                    className="artista-card-image"
                  />
                </div>

                {/* Meta Tags */}
                <div className="artista-card-meta">
                  <span className="artista-card-tag">Intérprete</span>
                </div>
                
                {/* Nome do Artista (Fonte Serifada Fraunces) */}
                <h2 className="artista-card-title">{artista.nome}</h2>
                
                {/* Texto de Apoio / Quantidade de Álbuns */}
                <p className="artista-card-excerpt">
                  {artista.bio || `Explore a discografia completa e as críticas detalhadas deste artista. Possui atualmente ${artista.albumCount} ${artista.albumCount === 1 ? 'álbum registrado' : 'álbuns registrados'} em nossa biblioteca.`}
                </p>
                
                {/* Botão de Ação Redondo Estilizado */}
                <div className="artista-card-footer-wrapper">
                  <span className="artista-card-btn-cta">
                    Ver Discografia
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Rodape />
    </div>
  );
}