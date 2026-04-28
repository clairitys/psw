import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import { EditarAvaliacao } from '../components/EditarAvaliacao/EditarAvaliacao';
import './style/Usuario.css'; 

export function Usuario() {
  const { albuns, artistas, avaliacoes, fetchDados } = useAlbumStore();
  
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [reviewSelecionada, setReviewSelecionada] = useState(null);

  const user = JSON.parse(localStorage.getItem('authUser'));
  const nomeUsuario = user?.username || "usuario";
  const bioUsuario = user?.bio || "Nenhuma biografia adicionada."; // Puxa a bio do usuário

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // Filtra avaliações do usuário logado
  const minhasReviews = avaliacoes.filter(rev => rev.usuario === nomeUsuario);

  // Pega os álbuns que o usuário marcou como "curtido" nas avaliações
  const idsFavoritos = minhasReviews
    .filter(rev => rev.curtido === true)
    .map(rev => rev.albumId);

  const albunsFavoritos = albuns.filter(album => idsFavoritos.includes(album.id));

  return (
    <div className="usuario-page-container">
      <Header />
      
      <main className="conteudo-principal">
        <div className="perfil-layout-restrito">
            <section className="usuario-header">
                <img src={user?.avatar || "/img/icon.jpg"} className="user-img-pfp" alt="Perfil" />
                <div className="info-usuario-container">
                    <h1 className="nome-display">{nomeUsuario}</h1>
                    <p className="user-bio">{bioUsuario}</p> {/* Nova Bio */}
                    <div className="Cbotão">
                        <Link to="/editar-perfil" className="botão-editar">EDITAR PERFIL</Link>
                    </div>   
                </div>
            </section>

            <div className="categorias-perfil">
                <div 
                    className={`cat-item ${abaAtiva === 'perfil' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('perfil')}
                >Perfil</div>
                <div 
                    className={`cat-item ${abaAtiva === 'avaliacoes' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('avaliacoes')}
                >Minhas Avaliações ({minhasReviews.length})</div>
            </div>
            <hr className="linha-separadora" />

            {abaAtiva === 'perfil' && (
                <section className="secao-perfil-listas">
                    <h2>Álbuns Favoritos</h2>
                    <div className="grid-favoritos-pf">
                        {albunsFavoritos.length > 0 ? (
                            albunsFavoritos.map(album => (
                                <Link to={`/album/${album.id}`} key={album.id} className="link-favorito">
                                    <img src={`/${album.capa}`} alt={album.titulo} title={album.titulo} />
                                </Link>
                            ))
                        ) : (
                            <p className="msg-vazio">Você ainda não favoritou nenhum álbum.</p>
                        )}
                    </div>
                </section>
            )}

            {abaAtiva === 'avaliacoes' && (
                <section className="secao-perfil-listas">
                    <h2>Minhas Avaliações Recentes</h2>
                    <div className="lista-feed-perfil">
                        {minhasReviews.length > 0 ? (
                            minhasReviews.map(review => {
                                const album = albuns.find(a => a.id === review.albumId);
                                const artista = artistas.find(art => art.id === (album?.artistaId || review.artistaId));
                                
                                return (
                                    <div 
                                        key={review.id} 
                                        onClick={() => setReviewSelecionada(review)} 
                                        className="container-card-clicavel"
                                    >
                                        <CardAvaliacao 
                                            capa={album?.capa ? `/${album.capa}` : "/img/default.jpg"}
                                            titulo={album?.titulo || "Álbum"}
                                            artista={artista?.nome || "Artista"}
                                            userImg={user?.avatar || "/img/icon.jpg"}
                                            username={nomeUsuario}
                                            estrelas={"★".repeat(review.estrelas) + "☆".repeat(5 - review.estrelas)}
                                            comentario={review.comentario}
                                            data={review.data}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <p className="msg-vazio">Você ainda não avaliou nada.</p>
                        )}
                    </div>
                </section>
            )}
        </div>
      </main>

      {reviewSelecionada && (
        <EditarAvaliacao 
            review={reviewSelecionada} 
            aoFechar={() => setReviewSelecionada(null)} 
        />
      )}

      <Rodape />
    </div>
  );
}