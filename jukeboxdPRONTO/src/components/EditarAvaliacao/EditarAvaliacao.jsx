import { useState, useEffect } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import './EditarAvaliacao.css'; // Pode copiar a base do Avaliacao.css

export function EditarAvaliacao({ review, aoFechar }) {
  const { albuns, artistas, adicionarAvaliacao, removerAvaliacao } = useAlbumStore();
  
  // Estados preenchidos com os dados da review existente
  const [nota, setNota] = useState(review.estrelas);
  const [comentario, setComentario] = useState(review.comentario);
  const [favorito, setFavorito] = useState(review.curtido || false);
  const [feedback, setFeedback] = useState(null); // 'editado' ou 'excluido'

  // Busca informações do álbum para exibir a capa e título
  const albumInfo = albuns.find(a => a.id === review.albumId);
  const artistaInfo = artistas.find(art => art.id === (albumInfo?.artistaId || review.artistaId));

  const lidarComEditar = async () => {
    if (!comentario.trim()) return alert("O comentário não pode estar vazio.");

    const reviewAtualizada = {
      ...review,
      estrelas: nota,
      comentario: comentario,
      curtido: favorito,
      dataEdicao: new Date().toLocaleDateString('pt-BR') // Opcional: marcar que foi editado
    };

    // No JSON Server, para editar usamos PUT na rota com o ID
    try {
      await fetch(`http://localhost:3001/avaliacoes/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewAtualizada),
      });
      
      // Atualiza o estado global recarregando os dados
      useAlbumStore.getState().fetchDados();
      
      setFeedback('editado');
      setTimeout(() => aoFechar(), 2000);
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  const lidarComExcluir = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta avaliação?")) {
      await removerAvaliacao(review.id);
      setFeedback('excluido');
      setTimeout(() => aoFechar(), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        
        {feedback ? (
          <div className="tela-feedback">
             <div className="feedback-content">
                <div className="check-icon">{feedback === 'excluido' ? '🗑️' : '✓'}</div>
                <p>{feedback === 'excluido' ? 'Avaliação removida!' : 'Alterações salvas com sucesso!'}</p>
             </div>
          </div>
        ) : (
          <div className="tela-form">
            <div className="form-conteudo">
              <div className="form-header">
                <h3>Editar sua avaliação</h3>
                <button className="btn-fechar" onClick={aoFechar}>×</button>
              </div>

              <div className="form-grid">
                <img src={albumInfo?.capa ? `/${albumInfo.capa}` : "/img/default.jpg"} className="capa-grande" alt="Capa" />
                
                <div className="form-inputs">
                  <h2>{albumInfo?.titulo || "Álbum"}</h2>
                  <span className="artista-destaque">{artistaInfo?.nome || "Artista"}</span>

                  <textarea 
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  ></textarea>

                  <div className="rating-footer">
                    <div className="star-box">
                      <label>Avaliação</label>
                      <div className="estrelas">
                        {[1, 2, 3, 4, 5].map(n => (
                          <span key={n} onClick={() => setNota(n)} className={n <= nota ? 'active' : ''}>★</span>
                        ))}
                      </div>
                    </div>

                    <div className="like-box">
                       <label>Curtir</label>
                       <button 
                          className={`like-btn ${favorito ? 'ativo' : ''}`} 
                          onClick={() => setFavorito(!favorito)}
                       >
                          {favorito ? '❤️' : '🤍'} 
                       </button>
                    </div>
                  </div>

                  <div className="botoes-acoes">
                    <button className="delete-btn" onClick={lidarComExcluir}>excluir</button>
                    <button className="save-btn" onClick={lidarComEditar}>atualizar</button>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}