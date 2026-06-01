import { useAlbumStore } from '../store/useAlbumStore';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape.jsx';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao.jsx';
import { Cadastro } from './Cadastro.jsx';
import { Busca } from '../components/Busca/Busca';
import './style/Inicio.css';

export function Inicio() {
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const carrosselRef = useRef(null);

  const { albuns, artistas, fetchDados } = useAlbumStore();

  useEffect(() => {
    if (typeof fetchDados === 'function') {
      fetchDados();
    }
    
    const user = localStorage.getItem('authUser');
    if (user) {
      try {
        setUsuarioLogado(JSON.parse(user));
      } catch (e) {
        console.error("Erro ao analisar authUser:", e);
      }
    }
  }, []); // Array de dependências vazio impede o loop infinito de navegação

  useEffect(() => {
    if (termo === '') {
      setTermoAtivo('');
    }
  }, [termo]);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  const rolarCarrossel = (direcao) => {
    if (carrosselRef.current) {
      const larguraVisivel = carrosselRef.current.clientWidth;
      const distanciaRolagem = larguraVisivel * 0.75; 
      carrosselRef.current.scrollBy({ left: direcao * distanciaRolagem, behavior: 'smooth' });
    }
  };

  const listaSegura = Array.isArray(albuns) ? albuns : [];
  const artistasSeguros = Array.isArray(artistas) ? artistas : [];

  const resultadosBusca = (termoAtivo.trim().length >= 2) 
    ? listaSegura.filter(album => {
        const termoLongo = termoAtivo.toLowerCase();
        const combinaTitulo = album.titulo?.toLowerCase().includes(termoLongo);
        const dadosArtista = artistasSeguros.find(art => String(art.id) === String(album.artistaId));
        const combinaArtista = dadosArtista?.nome?.toLowerCase().includes(termoLongo);
        return combinaTitulo || combinaArtista;
      }) 
    : [];

  return (
    <div className="home-container">
      <Header />
      <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

      <main className="conteudo-principal">
        {termoAtivo.length > 0 ? (
          <section className="resultados-container">
            <h2>Resultados para "{termoAtivo}"</h2>
            <div className="cards-busca">
              {resultadosBusca.length > 0 ? (
                resultadosBusca.map(album => {
                  const artistaCard = artistasSeguros.find(art => String(art.id) === String(album.artistaId));
                  return (
                    <Link to={`/album/${album.id}`} key={album.id} className="album-card-link">
                      <div className="album-card-busca">
                        <div className="capa-container"><img src={album.capa} alt={album.titulo} /></div>
                        <div className="info-album">
                          <h3>{album.titulo}</h3>
                          <p className="artista-busca-nome">{artistaCard?.nome || "Artista desconhecido"}</p>
                          <span className="data-lancamento">{album.data}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="busca-vazia">Nenhum álbum ou artista encontrado.</p>
              )}
            </div>
          </section> 
        ) : (
          <>
            <div className="hero-section">
              <h1 className="texto-chamada">
                Avalie as músicas e álbuns que você já ouviu.<br />
                Salve aquilo que você quer ouvir.<br />
                Compartilhe com seus amigos o que é bom.
              </h1>
              <p className="texto-chamada2">Escreva suas avaliações e compartilhe com os outros!</p>
            </div>

            <div className="Cbotão">
              <button className="botão" onClick={() => setModalCadastroAberto(true)}>Comece Já</button>
            </div>

            <div className="carrossel-wrapper">
              <button className="seta-carrossel seta-esquerda" onClick={() => rolarCarrossel(-1)}>&#10094;</button>
              <div className="albuns" ref={carrosselRef}>
                {listaSegura.length > 0 ? (
                  listaSegura.map((album) => (
                    <Link to={`/album/${album.id}`} key={album.id} className="vitrine-link">
                      <img src={album.capa} className="img" alt={album.titulo} title={album.titulo} />
                    </Link>
                  ))
                ) : (
                  <p className="carregando-texto">A carregar álbuns... 🎧</p>
                )}
              </div>
              <button className="seta-carrossel seta-direita" onClick={() => rolarCarrossel(1)}>&#10095;</button>
            </div>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              <div className="cards">
                {}
                <Link to="/review/rev5" style={{ textDecoration: 'none', color: 'inherit', flex: 1, minWidth: '300px' }}>
                  <CardAvaliacao capa="img/beatles.jpg" titulo="Abbey Road" artista="The Beatles" userImg="img/user.jpg" username="beatleMania" estrelas="★★★★★" comentario="Melhor forma de encerramento de banda possível." data="15/03/2026" />
                </Link>

                <Link to="/review/rev6" style={{ textDecoration: 'none', color: 'inherit', flex: 1, minWidth: '300px' }}>
                  <CardAvaliacao capa="img/justin.jpg" titulo="Believe" artista="Justin Bieber" userImg="img/icon.jpg" username="belieBers" estrelas="★★★★★" comentario="O melhor álbum da carreira dele." data="15/03/2026" />
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {modalCadastroAberto && <Cadastro aoFechar={() => setModalCadastroAberto(false)} />}
      <Rodape />
    </div>
  );
}