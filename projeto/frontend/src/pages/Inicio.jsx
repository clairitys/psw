import { useAlbumStore } from '../store/useAlbumStore';
import { useState, useEffect, useRef } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape.jsx';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao.jsx';
import { Cadastro } from './Cadastro.jsx';
import { Busca } from '../components/Busca/Busca';
import { findArtistaForAlbum, getEntityId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import './style/Inicio.css';

export function Inicio() {
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  const { albuns, artistas, reviews, fetchDados } = useAlbumStore();

  const carrosselRef = useRef(null);

  useEffect(() => {
    fetchDados();
    
    const user = localStorage.getItem('authUser');
    if (user) {
      const userParsed = JSON.parse(user);
      setUsuarioLogado(userParsed);
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

  const scrollEsquerda = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollDireita = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
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
    <div className="home-containerI">
      <Header />

      <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

      <main className="conteudo-principal">
        
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
                        <div className="capa-container">
                          <img src={formatCapaUrl(album.capa)} alt={album.titulo} />
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
              Avalie as músicas e álbuns que você já ouviu<br />
              Save aquilo que você quer ouvir <br />
              Compartilhe com seus amigos o que é bom
            </p>

            <div className="Cbotão">
              <button 
                className="botão" 
                onClick={() => setModalCadastroAberto(true)}
              >
                Comece Já
              </button>
            </div>

            <div className="carrossel-wrapper">
              <button type="button" className="seta-carrossel esquerda" onClick={scrollEsquerda}>‹</button>
              
              <div className="albuns" ref={carrosselRef}>
                {listaSegura.length > 0 ? (
                  listaSegura.slice(0, 11).map((album) => (
                    <Link to={`/album/${getEntityId(album)}`} key={getEntityId(album)} className="vitrine-link">
                      <img 
                        src={formatCapaUrl(album.capa)} 
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

              <button type="button" className="seta-carrossel direita" onClick={scrollDireita}>›</button>
            </div>

            <p className="texto-chamada2">Escreva suas avaliações e compartilhe com os outros! </p>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              
              {/* ATUALIZADO: Substituído 'cards' pela classe Grid 'grade-dupla-cards' */}
              <div className="grade-dupla-cards">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.slice(0, 4).map((review) => (
                    <Link 
                      to={`/review/${getEntityId(review)}`} 
                      key={getEntityId(review)} 
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
                    >
                      <CardAvaliacao
                        id={review.id}
                        _id={review._id}
                        album={review.album}
                        artist={review.artist}
                        rating={review.rating}
                        comment={review.comment}
                        user={review.user}
                        createdAt={review.createdAt}
                        capa={review.capa}
                      />
                    </Link>
                  ))
                ) : (
                  <p>Nenhuma avaliação publicada ainda.</p>
                )}
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