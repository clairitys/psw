import { useState } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import './Avaliacao.css';

export function Avaliacao({ aoFechar }) {
  const { albuns, artistas, adicionarAvaliacao } = useAlbumStore(); 
  const [pesquisa, setPesquisa] = useState('');
  const [albumSelecionado, setAlbumSelecionado] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState(''); // Novo estado para o texto
  const [favorito, setFavorito] = useState(false);
  const [feedback, setFeedback] = useState(false);

  const user = JSON.parse(localStorage.getItem('authUser'));

  const resultados = albuns
    .filter(a => a.titulo.toLowerCase().includes(pesquisa.toLowerCase()))
    .sort((a, b) => a.titulo.localeCompare(b.titulo));

  const lidarComSalvar = async () => {
    if (!comentario.trim() || nota === 0) {
        return alert("Por favor, dê uma nota e escreva um comentário.");
    }

    const novaReview = {
      albumId: albumSelecionado.id,
      artistaId: albumSelecionado.artistaId,
      usuario: user?.username || "Anônimo",
      estrelas: nota,
      comentario: comentario,
      data: new Date().toLocaleDateString('pt-BR'),
      curtido: favorito
    };

    await adicionarAvaliacao(novaReview);
    setFeedback(true);
    setTimeout(() => aoFechar(), 2000);
  };

  return (
    <div className="modal-overlay1" onClick={aoFechar}>
      <div className="modal-card2" onClick={e => e.stopPropagation()}>
        
        {feedback ? (
          <div className="tela-feedback">
             <div className="feedback-content">
                <div className="check-icon">✓</div>
                <p>Avaliação salva em seu perfil</p>
             </div>
          </div>
        ) : (
          <>
            {!albumSelecionado ? (
              <div className="tela-log1">
                <div className="modal-header1">
                  <span>Avaliar</span>
                  <button className="close-x" onClick={aoFechar}>×</button>
                </div>
                <div className="busca-corpo1">
                  <input 
                    type="text1" 
                    autoFocus 
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Busque por um álbum..."
                  />
                  <div className="resultados-container">
                    {pesquisa && resultados.map(album => {
                      const artistaInfo = artistas.find(art => art.id === album.artistaId);
                      return (
                        <div key={album.id} className="item-resultado" onClick={() => setAlbumSelecionado(album)}>
                          <img src={`/${album.capa}`} alt="capa" />
                          <div className="item-info">
                            <strong>{album.titulo}</strong>
                            <span className="res-artista">{artistaInfo?.nome}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="tela-form">
                <div className="form-conteudo">
                  <div className="form-header">
                    <button className="btn-voltar" onClick={() => setAlbumSelecionado(null)}> ⭠ </button>
                    <button className="btn-fechar" onClick={aoFechar}>×</button>
                  </div>

                  <div className="form-grid">
                    <img src={`/${albumSelecionado.capa}`} className="capa-grande" alt="Capa" />
                    
                    <div className="form-inputs">
                      <h2>{albumSelecionado.titulo}</h2>
                      <span className="artista-destaque">
                        {artistas.find(art => art.id === albumSelecionado.artistaId)?.nome}
                      </span>

                      <div className="opcoes-rapidas">
                         <label><input type="checkbox" defaultChecked /> Ouvi em {new Date().toLocaleDateString()}</label>
                         <label><input type="checkbox" defaultChecked /> Já ouvi antes </label>
                      </div>

                        <textarea 
                        placeholder="Adicionar avaliação..."
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
                      <button className="save-btn" onClick={lidarComSalvar}>salvar</button>
                    </div> 
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}