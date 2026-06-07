import React, { useState, useEffect } from 'react';
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

  const listaSegura = Array.isArray(albuns) ? albuns : [];

  const resultadosBusca = (termoAtivo.trim().length >= 2) 
    ? listaSegura.filter(album => {
        const termoLongo = termoAtivo.toLowerCase();
        const combinaTitulo = album.titulo?.toLowerCase().includes(termoLongo);
        const dadosArtista = findArtistaForAlbum(artistas, album);
        const combinaArtista = dadosArtista?.nome?.toLowerCase().includes(termoLongo);
        return combinaTitulo || combinaArtista;
      }) 
    : [];

  return (
    <div className="home-container">
      <Header />

      {/* Wrapper que controla o crescimento do conteúdo e empurra o Rodapé */}
      <div className="home-content-wrapper">
        
        {/* Container de busca com correção de vazamento */}
        <div className="busca-container-fix">
          <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />
        </div>

        {termoAtivo.length > 0 ? (
  <section className="resultados-container">
    <h2>Resultados para "{termoAtivo}"</h2>
    <div className="cards-busca">
      {resultadosBusca.length > 0 ? (
        resultadosBusca.map(album => {
          const artistaCard = findArtistaForAlbum(artistas, album);
          return (
            <Link to={`/album/${getEntityId(album)}`} key={getEntityId(album)} className="album-card-link">
              <div className="album-card-busca">
                <img src={formatCapaUrl(album.capa)} alt={album.titulo} />
                <div className="info-album">
                  <h3>{album.titulo}</h3>
                  <p>{artistaCard?.nome || "Artista desconhecido"}</p>
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
  /* ... resto do código ... */

          <div className="conteudo-estilizado">
            <p className="welcome-text">Bem vindo de volta, {nomeUsuario}! ✮⋆˙</p>

            <section className="avaliações">
              <h2>Mais bem avaliados da semana</h2>
              <hr />
              <div className="albuns">
                {listaSegura.slice(0, 9).map((album) => (
                  <Link to={`/album/${getEntityId(album)}`} key={getEntityId(album)}>
                    <img src={formatCapaUrl(album.capa)} className="img" alt={album.titulo} />
                  </Link>
                ))}
              </div>
            </section>

            <section className="popular">
              <h2>Popular entre amigos</h2>
              <hr />
              <div className="cards">
                {/* Aqui tornamos a seção dinâmica pegando álbuns diferentes da lista */}
                {Array.isArray(reviews) && reviews.slice(0, 4).map((review) => (
                  <CardAvaliacao
                    key={review.id || review._id}
                    album={review.album}
                    artist={review.artist}
                    rating={review.rating}
                    comment={review.comment}
                    user={review.user}
                    createdAt={review.createdAt}
                  />
                ))}
              </div>
            </section>

            <section className="generos">
              <h2>Gêneros procurados</h2>
              <hr />
              <div className="genCard">
                <div className="image"><img src="img/bossa-nova.webp" alt="Bossa Nova" /></div>
                <div className="conteudo">
                  <span className="title">Bossa Nova</span>
                  <p>Movimento musical brasileiro surgido no Rio de Janeiro...</p>
                </div>
              </div>
            </section>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              <div className="cards">
                {Array.isArray(reviews) && reviews.slice(0, 4).map((review) => (
                  <CardAvaliacao
                    key={getEntityId(review)}
                    id={review.id}
                    album={review.album}
                    artist={review.artist}
                    rating={review.rating}
                    comment={review.comment}
                    user={review.user}
                    createdAt={review.createdAt}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <Rodape />
    </div>
  );
}