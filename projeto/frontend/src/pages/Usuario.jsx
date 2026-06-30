import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { getEntityId } from '../utils/ids';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import './style/Usuario.css'; 

export function Usuario() {
  const { albuns, artistas, reviews, fetchDados } = useAlbumStore();
  
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');
  // Estado para controlar qual aba está visível: 'perfil', 'albuns' ou 'avaliacoes'
  const [abaAtiva, setAbaAtiva] = useState('perfil');

  // Recupera dados do usuário logado
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  const nomeUsuario = user?.username || 'usuario';
  const meuId = getEntityId(user);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // Filtra as avaliações feitas por este usuário específico
  const minhasReviews = reviews.filter(
    (rev) =>
      rev.user?.username === nomeUsuario ||
      getEntityId(rev.user) === meuId
  );

  // Filtra comentários feitos por este usuário em todas as reviews
  const meusComentarios = reviews
    .flatMap(review => 
      (review.comentarios || []).map(comentario => ({
        ...comentario,
        reviewId: getEntityId(review),
        albumTitulo: review.album,
        albumArtista: review.artist,
        albumCapa: review.capa
      }))
    )
    .filter(com => com.user?.username === nomeUsuario || getEntityId(com.user) === meuId);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  return (
    <div className="usuario-page-container">
      <Header />
      
      <main className="conteudo-principal">
        {/* CONTAINER DA BUSCA PADRONIZADO (Estilizado para o tema escuro) */}

        <div className="perfil-layout-restrito">
            {/* Header do Usuário (Foto, Nome e as Contagens do Letterboxd) */}
            <section className="usuario-header">
                <div className="usuario-perfil-esquerda">
                    <img src={user?.avatar || "/img/icon.jpg"} className="user-img-pfp" alt="Perfil" />
                    <div className="info-usuario-container">
                        <div className="nome-acoes-linha">
                            <h1 className="nome-display">{nomeUsuario}</h1>
                            <Link to="/editar-perfil" className="botao-editar">EDITAR PERFIL</Link>
                        </div>
                    </div>
                </div>

                {/* Métricas do lado direito baseadas na referência */}
                <div className="usuario-estatisticas">
                    <div className="estatistica-item">
                        <span className="estatistica-numero">{minhasReviews.length}</span>
                        <span className="estatistica-label">ÁLBUNS</span>
                    </div>
                    <div className="estatistica-item">
                        <span className="estatistica-numero">{minhasReviews.length}</span> {/* Ou métrica específica */}
                        <span className="estatistica-label">ESTE ANO</span>
                    </div>
                    <div className="estatistica-item">
                        <span className="estatistica-numero">0</span>
                        <span className="estatistica-label">SEGUINDO</span>
                    </div>
                    <div className="estatistica-item">
                        <span className="estatistica-numero">0</span>
                        <span className="estatistica-label">SEGUIDORES</span>
                    </div>
                </div>
            </section>

            {/* Menu de Categorias Clicáveis */}
            <div className="categorias-perfil">
                <div 
                    className={`cat-item ${abaAtiva === 'perfil' ? 'active' : ''}`} 
                    onClick={() => setAbaAtiva('perfil')}
                >
                    Perfil
                </div>
                <div 
                    className={`cat-item ${abaAtiva === 'albuns' ? 'active' : ''}`} 
                    onClick={() => setAbaAtiva('albuns')}
                >
                    Álbuns ({minhasReviews.length})
                </div>
                <div 
                    className={`cat-item ${abaAtiva === 'avaliacoes' ? 'active' : ''}`} 
                    onClick={() => setAbaAtiva('avaliacoes')}
                >
                    Minhas Avaliações
                </div>
                <div 
                    className={`cat-item ${abaAtiva === 'comentarios' ? 'active' : ''}`} 
                    onClick={() => setAbaAtiva('comentarios')}
                >
                    Comentários ({meusComentarios.length})
                </div>
            </div>
            <hr className="linha-separadora" />

            {/* RENDERIZAÇÃO DINÂMICA DAS ABAS */}
            
            {abaAtiva === 'perfil' && (
                <>
                    {/* Seção de Favoritos */}
                    <section className="secao-perfil-listas">
                        <h2 className="titulo-secao-letter">ÁLBUNS FAVORITOS</h2>
                        <div className="grid-favoritos-pf">
                            <div className="moldura-album"><img src="/img/skz3.jpg" alt="Fav 1" /></div>
                            <div className="moldura-album"><img src="/img/hhouse.jpg" alt="Fav 2" /></div>
                            <div className="moldura-album"><img src="/img/gaga.jpg" alt="Fav 3" /></div>
                            <div className="moldura-album"><img src="/img/lana.jpg" alt="Fav 4" /></div>
                        </div>
                    </section>

                    {/* Resumo rápido das últimas avaliações na home do perfil */}
                    <section className="secao-perfil-listas">
                        <h2 className="titulo-secao-letter">AVALIAÇÕES RECENTES</h2>
                        <div className="lista-feed-perfil">
                            {minhasReviews.slice(0, 3).map(review => (
                                <CardAvaliacao 
                                    key={getEntityId(review)}
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
                            ))}
                            {minhasReviews.length === 0 && (
                                <p className="msg-vazio">Você ainda não fez nenhuma avaliação.</p>
                            )}
                        </div>
                    </section>
                </>
            )}

            {abaAtiva === 'albuns' && (
                <section className="secao-perfil-listas">
                    <h2 className="titulo-secao-letter">TODOS OS ÁLBUNS AVALIADOS</h2>
                    <div className="grid-favoritos-pf tudo-avaliado">
                        {minhasReviews.length > 0 ? (
                            minhasReviews.map(review => (
                                <div key={getEntityId(review)} className="moldura-album" title={review.album}>
                                    <img src={review.album?.cover || "/img/gaga.jpg"} alt={review.album} />
                                </div>
                            ))
                        ) : (
                            <p className="msg-vazio">Nenhum álbum registrado ainda.</p>
                        )}
                    </div>
                </section>
            )}

            {abaAtiva === 'avaliacoes' && (
                <section className="secao-perfil-listas">
                    <h2 className="titulo-secao-letter">TODAS AS MINHAS AVALIÇÕES</h2>
                    <div className="lista-feed-perfil">
                        {minhasReviews.length > 0 ? (
                            minhasReviews.map(review => (
                                <CardAvaliacao 
                                    key={getEntityId(review)}
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
                            ))
                        ) : (
                            <p className="msg-vazio">Você ainda não fez nenhuma avaliação.</p>
                        )}
                    </div>
                </section>
            )}

            {abaAtiva === 'comentarios' && (
                <section className="secao-perfil-listas">
                    <h2 className="titulo-secao-letter">MEUS COMENTÁRIOS</h2>
                    <div className="lista-feed-perfil">
                        {meusComentarios.length > 0 ? (
                            meusComentarios.map((com, idx) => (
                                <Link 
                                    key={com._id || idx} 
                                    to={`/review/${com.reviewId}`}
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
                                >
                                    <div className="comentario-perfil-card">
                                        <div className="comentario-header-perfil">
                                            <img src={com.albumCapa?.startsWith('http') || com.albumCapa?.startsWith('/') ? com.albumCapa : `/${com.albumCapa || 'img/default-album.jpg'}`} alt={com.albumTitulo} className="comentario-capa-pequena" />
                                            <div className="comentario-info-perfil">
                                                <h4 className="comentario-album-titulo">{com.albumTitulo}</h4>
                                                <p className="comentario-album-artista">por {com.albumArtista}</p>
                                                <small className="comentario-data-perfil">{new Date(com.createdAt).toLocaleDateString('pt-BR')}</small>
                                            </div>
                                        </div>
                                        <p className="comentario-texto-perfil">{com.texto}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="msg-vazio">Você ainda não fez nenhum comentário.</p>
                        )}
                    </div>
                </section>
            )}
        </div>
      </main>
      <Rodape />
    </div>
  );
}