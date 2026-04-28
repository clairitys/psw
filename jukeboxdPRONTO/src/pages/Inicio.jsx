import { useAlbumStore } from '../store/useAlbumStore';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  
  // Estado para controlar se o usuário está logado
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  const { albuns, artistas, fetchDados } = useAlbumStore();

  useEffect(() => {
    fetchDados();
    
    // Verifica se existe um usuário no localStorage ao carregar a página
    const user = localStorage.getItem('authUser');
    if (user) {
      const userParsed = JSON.parse(user);
      setUsuarioLogado(userParsed);
      // Se já estiver logado, redireciona para a Home
      navigate('/home'); 
    }
  }, [fetchDados, navigate]);

  useEffect(() => {
    if (termo === '') {
      setTermoAtivo('');
    }
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

      <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

      <main className="conteudo-principal">
        
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
                        <div className="capa-container">
                          <img src={album.capa} alt={album.titulo} />
                        </div>

                        <div className="info-album">
                          <div className="titulo-linha">
                            <h3>{album.titulo}</h3>
                            <p>{artistaCard?.nome || "Artista desconhecido"}</p>
                            <span className="data-lancamento">{album.data}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p>Nenhum álbum ou artista encontrado.</p>
              )}
            </div>
          </section> 
        ) : (
          <>
            <p className="texto-chamada">
              Avalie as músicas e álbuns que você já ouviu.<br />
              Salve aquilo que você quer ouvir ★ˎˊ˗<br />
              Compartilhe com seus amigos o que é bom.
            </p>

            <div className="Cbotão">
              <button 
                className="botão" 
                onClick={() => setModalCadastroAberto(true)}
              >
                Comece Já
              </button>
            </div>

            <div className="albuns">
              {listaSegura.length > 0 ? (
                listaSegura.slice(0, 11).map((album) => (
                  <Link to={`/album/${album.id}`} key={album.id} className="vitrine-link">
                    <img 
                      src={album.capa} 
                      className="img" 
                      alt={album.titulo} 
                      title={`${album.titulo}`}
                    />
                  </Link>
                ))
              ) : (
                <p>A carregar álbuns maravilhosos... 🎧</p>
              )}
            </div>

            <p className="texto-chamada2">Escreva suas avaliações e compartilhe com os outros! ⭒˚.⋆</p>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              <div className="cards">
                <CardAvaliacao 
                  capa="img/beatles.jpg"
                  titulo="Abbey Road"
                  artista="The Beatles"
                  userImg="img/user.jpg"
                  username="beatleMania"
                  estrelas="★★★★★"
                  comentario="Melhor forma de encerramento de banda possível."
                  data="15/03/2026"
                />
                <CardAvaliacao 
                  capa="img/justin.jpg"
                  titulo="Believe"
                  artista="Justin Bieber"
                  userImg="img/icon.jpg"
                  username="belieBers"
                  estrelas="★★★★★"
                  comentario="O melhor álbum da carreira dele."
                  data="15/03/2026"
                />
              </div>
            </section>
          </>
        )}
      </main>

      {modalCadastroAberto && (
        <Cadastro aoFechar={() => setModalCadastroAberto(false)} />
      )}

      <Rodape />
    </div>
  );
}