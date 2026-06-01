import React, { useState } from 'react';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao';
import './style/suaAvaliacao.css';

export function SuaAvaliacao() {
  const { albuns, artistas, avaliacoes, adicionarAvaliacao } = useAlbumStore();
  const [comentario, setComentario] = useState('');
  
  // Pegamos o usuário logado
  const user = JSON.parse(localStorage.getItem('authUser'));

  // Exemplo: Simulando que estamos avaliando o álbum do Harry Styles (id 1)
  // Em uma aplicação real, você passaria esse ID via URL ou Estado
  const albumAlvo = albuns.find(a => a.id === 1) || albuns[0];
  const artistaAlvo = artistas.find(art => art.id === albumAlvo?.artistaId);

  const salvarReview = () => {
    if (!comentario.trim()) return alert("Escreva algo antes de salvar!");

    const novaReview = {
      id: Date.now(),
      albumId: albumAlvo.id,
      artistaId: artistaAlvo.id,
      usuario: user?.username || "Anônimo",
      estrelas: 5, // Aqui você pode adicionar um estado de estrelas se desejar
      comentario: comentario,
      data: new Date().toLocaleDateString('pt-BR')
    };

    adicionarAvaliacao(novaReview);
    setComentario('');
    alert("Avaliação salva com sucesso!");
  };

  return (
    <div className="sua-avaliacao-page">
      <Header />
      
      <main className="container2">
        <section className="busca">
          <div className="barra">
            <input type="text" placeholder="Pesquisar álbuns, artistas, listas..." />
            <button type="submit">buscar</button>
          </div>
        </section>
      </main>

      <div className="container3">
        <div className="review-card">
          <div className="album-header">
            <img src={`/${albumAlvo?.capa}`} alt="Capa" className="album-cover" />

            <div className="album-details">
              <h1 className="album-title">{albumAlvo?.titulo}</h1>
              <p className="album-artist">por <span className="artist-name">{artistaAlvo?.nome}</span></p>

              <div className="details-grid">
                <div className="info-column">
                  <p>Publicado 06 de Março, 2026</p>
                  <p>12 Músicas</p>
                  <div className="userspace">
                    <img src={user?.avatar || "/img/user.jpg"} className="img3" alt="User" />
                    <h2 className="usuario">{user?.username || "usuário"}</h2>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>

                <div className="info-column">
                  <div className="global-rating">
                    <span className="rating-score">⭐ 4.7 (150M)</span>
                  </div>
                  <p><strong>Gênero:</strong> Pop rock, Synthpop</p>
                  <button onClick={salvarReview} className="save-review-btn">Publicar Avaliação</button>
                </div>
              </div>

              <div className="review-input-area">
                <textarea 
                  className="comment-input" 
                  placeholder="Escreva uma avaliação..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="avaliações">
        <h2>Principais avaliações da semana</h2>
        <hr />
        <div className="cards">
          {/* Aqui listamos as avaliações globais do sistema vinculando dinamicamente ao ID */}
          {avaliacoes.slice(0, 2).map(rev => (
            <Link to={`/review/${rev.id}`} key={rev.id} style={{ textDecoration: 'none', color: 'inherit', flex: 1, minWidth: '300px' }}>
                <CardAvaliacao {...rev} username={rev.usuario} />
       </Link>
    ))}
  </div>
</section>

      <Rodape />
    </div>
  );
}