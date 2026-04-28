import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao.jsx';
import { Busca } from '../components/Busca/Busca';
import './style/Home.css'; 

export function Home() {
  const navigate = useNavigate();
  const { albuns, artistas, fetchDados } = useAlbumStore();
  
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
        const dadosArtista = artistas.find(art => art.id === album.artistaId);
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
          const artistaCard = artistas.find(art => art.id === album.artistaId);
          return (
            <Link to={`/album/${album.id}`} key={album.id} className="album-card-link">
              <div className="album-card-busca">
                <img src={album.capa} alt={album.titulo} />
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
                  <Link to={`/album/${album.id}`} key={album.id}>
                    <img src={album.capa} className="img" alt={album.titulo} />
                  </Link>
                ))}
              </div>
            </section>

            <section className="popular">
              <h2>Popular entre amigos</h2>
              <hr />
              <div className="cards">
                {listaSegura.slice(4, 8).map((album, index) => (
                  <div className="amigos" key={album.id || index}>
                    <Link to={`/album/${album.id}`}>
                      <img src={album.capa} className="pp" alt={album.titulo} />
                    </Link>
                    <div className="user">
                      <img src={`img/user${index + 1}.jpg`} className="pfp1" alt="user" 
                           onError={(e) => e.target.src = 'img/user.jpg'} />
                      <h2 className="username">amigo_{index + 1}</h2>
                    </div>
                  </div>
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
                  <p>movimento musical brasileiro surgido no Rio de Janeiro no final da década de 1950, 
                    caracterizado pela fusão do samba com o cool jazz. Marcos como o violão de João Gilberto 
                    e composições de Tom Jobim e Vinícius de Moraes trouxeram uma sonoridade intimista, 
                    canto falado e letras poéticas sobre o cotidiano.</p>
                </div>
              </div>
            </section>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              <div className="cards">
                <CardAvaliacao 
                  capa="img/beatles.jpg" titulo="Abbey Road" artista="The Beatles"
                  userImg="img/user.jpg" username="beatleMania" estrelas="★★★★★"
                  comentario="Melhor forma de encerramento de banda possível." data="15/03/2026"
                />
                <CardAvaliacao 
                  capa="img/justin.jpg" titulo="Believe" artista="Justin Bieber"
                  userImg="img/icon.jpg" username="belieBers" estrelas="★★★★★"
                  comentario="O melhor álbum da carreira dele." data="15/03/2026"
                />
              </div>
            </section>
          </div>
        )}
      </div>

      <Rodape />
    </div>
  );
}