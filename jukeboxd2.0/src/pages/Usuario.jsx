import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import './style/Usuario.css'; 

export function Usuario() {
  const { albuns, artistas, avaliacoes, fetchDados } = useAlbumStore();
  
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');

  // Recupera dados do usuário logado
  const user = JSON.parse(localStorage.getItem('authUser'));
  const nomeUsuario = user?.username || "usuario";

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // Filtra as avaliações feitas por este usuário específico
  const minhasReviews = avaliacoes.filter(rev => rev.usuario === nomeUsuario);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  return (
    <div className="usuario-page-container">
      <Header />
      
      <main className="conteudo-principal">
        {/* CONTAINER DA BUSCA PADRONIZADO (Igual à Home) */}
        <section className="container-busca-padrao">
            <div className="busca-interna">
                <h2>Olá, {nomeUsuario}! Pesquise algo novo:</h2>
                <div className="barra-busca-padrao">
                    <input 
                        type="text" 
                        placeholder="Pesquisar álbuns, artistas..." 
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                    />
                    <button onClick={lidarComBusca}>buscar</button>
                </div>
            </div>
        </section>

        <div className="perfil-layout-restrito">
            {/* Header do Usuário (Foto e Nome) */}
            <section className="usuario-header">
                <img src={user?.avatar || "/img/icon.jpg"} className="user-img-pfp" alt="Perfil" />
                <div className="info-usuario-container">
                    <h1 className="nome-display">{nomeUsuario}</h1>
                    <div className="Cbotão">
                        <Link to="/editar-perfil" className="botão-editar">EDITAR PERFIL</Link>
                    </div>   
                </div>
            </section>

            {/* Menu de Categorias */}
            <div className="categorias-perfil">
                <div className="cat-item active">Perfil</div>
                <div className="cat-item">Álbuns ({minhasReviews.length})</div>
                <div className="cat-item">Minhas Avaliações</div>
            </div>
            <hr className="linha-separadora" />

            {/* Seção de Favoritos (Destaque visual) */}
            <section className="secao-perfil-listas">
                <h2>Álbuns Favoritos</h2>
                <div className="grid-favoritos-pf">
                    <img src="/img/ateez.jpg" alt="Fav 1" />
                    <img src="/img/hs2.png" alt="Fav 2" />
                    <img src="/img/gaga.jpg" alt="Fav 3" />
                    <img src="/img/lana.jpg" alt="Fav 4" />
                </div>
            </section>

            {/* SEÇÃO DINÂMICA: MINHAS AVALIAÇÕES (Onde caem as do modal) */}
            <section className="secao-perfil-listas">
                <h2>Minhas Avaliações Recentes</h2>
                <hr className="linha-sub" />
                <div className="lista-feed-perfil">
                    {minhasReviews.length > 0 ? (
                        minhasReviews.map(review => {
                            const album = albuns.find(a => a.id === review.albumId);
                            const artista = artistas.find(art => art.id === (album?.artistaId || review.artistaId));
                            
                            return (
                                <CardAvaliacao 
                                    key={review.id}
                                    capa={album?.capa ? `/${album.capa}` : "/img/default.jpg"}
                                    titulo={album?.titulo || "Álbum desconhecido"}
                                    artista={artista?.nome || "Artista"}
                                    userImg={user?.avatar || "/img/icon.jpg"}
                                    username={nomeUsuario}
                                    estrelas={"★".repeat(review.estrelas) + "☆".repeat(5 - review.estrelas)}
                                    comentario={review.comentario}
                                    data={review.data}
                                />
                            );
                        })
                    ) : (
                        <p className="msg-vazio">Você ainda não fez nenhuma avaliação.</p>
                    )}
                </div>
            </section>
        </div>
      </main>
      <Rodape />
    </div>
  );
}