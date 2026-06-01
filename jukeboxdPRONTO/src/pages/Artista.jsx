import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { Busca } from '../components/Busca/Busca';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import './style/Artista.css'; 

export function Artista() {
  const { id } = useParams(); 
  const { albuns, artistas, avaliacoes, fetchDados } = useAlbumStore();

  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (termo === '') setTermoAtivo('');
  }, [termo]);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  const artistaAtual = artistas.find(art => String(art.id) === String(id));
  const albunsDoArtista = albuns.filter(a => String(a.artistaId) === String(id));
  const avaliacoesDoArtista = avaliacoes.filter(av => String(av.artistaId) === String(id));

  const resultadosBusca = (termoAtivo.length >= 2) 
    ? albuns.filter(a => a.titulo?.toLowerCase().includes(termoAtivo.toLowerCase())) 
    : [];

  if (artistas.length === 0) return <div className="carregando">Carregando...</div>;
  if (!artistaAtual && termoAtivo === '') return <div className="erro">Artista não encontrado.</div>;

  return (
    <div className="artista-page-wrapper">
      <Header />
      
        <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

      <div className="conteudo">
        {termoAtivo.length > 0 ? (
          <section className="avaliações">
            <h2>Resultados para "{termoAtivo}"</h2>
            <div className="cards">
              {resultadosBusca.map(res => (
                <Link to={`/album/${res.id}`} key={res.id} style={{ textDecoration: 'none' }}>
                   <div className="avCT">
                      <img src={`/${res.capa}`} className="img1" alt={res.titulo} />
                      <div className="info">
                        <h1>{res.titulo}</h1>
                        <h2 className="subtitulo">{artistaAtual?.nome}</h2>
                      </div>
                   </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* SEÇÃO DO PERFIL */}
            <div className="artista">
              <img 
                src={`/${artistaAtual.foto || 'img/' + artistaAtual.id + '.jpg'}`} 
                className="artistapfp" 
                alt={artistaAtual.nome} 
              />
              <div className="nome">
                <h1>{artistaAtual.nome}</h1>
                <div className="infos">
                    <span> sobre o artista ✭ <br />
                    </span>
                    <div className="biografia1">
                    <span >
                      {artistaAtual.biografia || "Biografia não disponível."}
                    </span>
                    {artistaAtual.generos && (
                      <div style={{marginTop: '20px'}}>
                        <strong>Gêneros: </strong>
                        {artistaAtual.generos.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO DISCOGRAFIA */}
            <section className="avaliações2">
              <h2>Discografia</h2>
              <hr />
              <div className="albuns" >
                {albunsDoArtista.map(album => (
                  <Link to={`/album/${album.id}`} key={album.id}>
                    <img src={`/${album.capa}`} className="img3" alt={album.titulo} />
                  </Link>
                ))}
              </div>
            </section>

            {/* SEÇÃO AVALIAÇÕES - ÚNICA E CORRIGIDA */}
            <section className="avaliações2">
              <h2>Principais avaliações do artista</h2>
              <hr />
              <div className="cards">
                {avaliacoesDoArtista.length > 0 ? (
                  avaliacoesDoArtista.map(review => {
                    const album = albuns.find(a => a.id === review.albumId);
                    return (
                      <CardAvaliacao 
                        key={review.id}
                        capa={`/${album?.capa}`} 
                        titulo={album?.titulo}
                        artista={artistaAtual.nome}
                        userImg="/img/user.jpg"
                        username={review.usuario}
                        estrelas={"★".repeat(review.estrelas) + "☆".repeat(5 - review.estrelas)}
                        comentario={review.comentario}
                        data={review.data}
                      />
                    );
                  })
                ) : (
                  <p className="subtitulo">
                    O artista não possui nenhuma avaliação.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <Rodape />
    </div>
  );
}