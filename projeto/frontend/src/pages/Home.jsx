import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { findArtistaForAlbum, getEntityId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao.jsx';
import { Busca } from '../components/Busca/Busca';
import './style/Home.css'; 

export function Home() {
  const navigate = useNavigate();
  const { albuns, artistas, reviews, fetchDados } = useAlbumStore();
  
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');

  // Referência atrelada ao container do carrossel horizontal
  const carrosselRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('authUser'));
  const nomeUsuario = user?.username || "usuário";

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (termo === '') setTermoAtivo('');
  }, [termo]);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  // Função que move a rolagem para a esquerda ou direita ao clicar nas setas
  const scrollCarrossel = (direcao) => {
    if (carrosselRef.current) {
      const valorScroll = (180 + 20) * 3; // Move o equivalente a 3 álbuns por clique
      carrosselRef.current.scrollBy({
        left: direcao === 'esquerda' ? -valorScroll : valorScroll,
        behavior: 'smooth'
      });
    }
  };

  const listaSegura = Array.isArray(albuns) ? albuns : [];

  const resultadosBusca = (termoAtivo.trim().length >= 2) 
    ? listaSegura.filter(album => {
        const termoLongo = termoAtivo.toLowerCase();
        const combinaTitulo = album.titulo?.toLowerCase().includes(termoLongo);
        const dadosArtista = findArtistaForAlbum(artistas || [], album);
        const combinaArtista = dadosArtista?.nome?.toLowerCase().includes(termoLongo);
        return combinaTitulo || combinaArtista;
      }) 
    : [];

  return (
    <div className="home-container">
      <Header />

      <main className="conteudo-principal">
        
        <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

        {termoAtivo.length > 0 ? (
          <section className="resultados-container">
            <h2>Resultados para "{termoAtivo}"</h2>
            <div className="cards-busca">
              {resultadosBusca.length > 0 ? (
                resultadosBusca.map(album => {
                  const artistaCard = findArtistaForAlbum(artistas || [], album);
                  return (
                    <Link to={`/album/${getEntityId(album)}`} key={getEntityId(album)} className="album-card-link">
                      <div className="album-card-busca">
                        <img src={formatCapaUrl(album.capa)} alt={album.titulo} />
                        <div className="info-album">
                          <h3>{album.titulo}</h3>
                          <p>{artistaCard?.nome || 'Artista desconhecido'}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="sem-resultado">Nenhum álbum ou artista encontrado.</p>
              )}
            </div>
          </section>
        ) : (
          <div className="conteudo-estilizado">
            <p className="welcome-text">Bem vindo de volta, {nomeUsuario}!</p>

            <section className="avaliações">
              <h2>Mais bem avaliados da semana</h2>
              <hr />
              
              {/* Wrapper estrutural para fixar as setas por cima e nas pontas */}
              <div className="carrossel-wrapper">
                <button 
                  className="seta-carrossel esquerda" 
                  onClick={() => scrollCarrossel('esquerda')}
                  aria-label="Rolar para esquerda"
                >
                  ‹
                </button>

                <div className="albuns1" ref={carrosselRef}>
                  {listaSegura.slice(0, 9).map((album) => (
                    <Link 
                      to={`/album/${getEntityId(album)}`} 
                      key={getEntityId(album)}
                      className="vitrine-link"
                    >
                      <img src={formatCapaUrl(album.capa)} className="img" alt={album.titulo} />
                    </Link>
                  ))}
                </div>

                <button 
                  className="seta-carrossel direita" 
                  onClick={() => scrollCarrossel('direita')}
                  aria-label="Rolar para direita"
                >
                  ›
                </button>
              </div>
            </section>

            <section className="popular">
              <h2>Popular entre amigos</h2>
              <hr />
              <div className="grade-dupla-cards">
                {Array.isArray(reviews) && reviews.slice(0, 3).map((review) => (
                  <Link to={`/review/${getEntityId(review)}`} key={review.id || review._id}>
                    <CardAvaliacao
                      album={review.album}
                      artist={review.artist}
                      rating={review.rating}
                      comment={review.comment}
                      user={review.user}
                      createdAt={review.createdAt}
                      capa={review.capa}
                    />
                  </Link>
                ))}
              </div>
            </section>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              <div className="grade-dupla-cards">
                {Array.isArray(reviews) && reviews.slice(0, 3).map((review) => (
                  <Link to={`/review/${getEntityId(review)}`} key={getEntityId(review)}>
                    <CardAvaliacao
                      id={review.id}
                      album={review.album}
                      artist={review.artist}
                      capa={review.capa}
                      rating={review.rating}
                      comment={review.comment}
                      user={review.user}
                      createdAt={review.createdAt}
                    />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <Rodape />
    </div>
  );
}