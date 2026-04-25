import { useState } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import './Avaliacao.css';

export function Avaliacao({ aoFechar }) {
  const { albuns, artistas } = useAlbumStore(); 
  const [pesquisa, setPesquisa] = useState('');
  const [albumSelecionado, setAlbumSelecionado] = useState(null);
  const [nota, setNota] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [feedback, setFeedback] = useState(false);

  const resultados = albuns
    .filter(a => a.titulo.toLowerCase().includes(pesquisa.toLowerCase()))
    .sort((a, b) => a.titulo.localeCompare(b.titulo));

  const lidarComSalvar = () => {
    setFeedback(true);
    setTimeout(() => aoFechar(), 2000);
  };

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        
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
              /* TELA 1: BUSCA */
              <div className="tela-log">
                <div className="modal-header">
                  <span>Avaliar</span>
                  <button className="close-x" onClick={aoFechar}>×</button>
                </div>
                <div className="busca-corpo">
                  <input 
                    type="text" 
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
                            <span className="res-artista">{artistaInfo?.nome || "Artista desconhecido"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* TELA 2: FORMULÁRIO */
              <div className="tela-form">
                <div className="fundo-blur" style={{ backgroundImage: `url(/${albumSelecionado.capa})` }}></div>
                <div className="form-conteudo">
                  <div className="form-header">
                    <button className="btn-voltar" onClick={() => setAlbumSelecionado(null)}> ⭠ </button>
                    <button className="btn-fechar" onClick={aoFechar}>×</button>
                  </div>

                  <div className="form-grid">
                    <img src={`/${albumSelecionado.capa}`} className="capa-grande" alt="Capa" />
                    
                    <div className="form-inputs">
                      <h2>{albumSelecionado.titulo} <small>{albumSelecionado.data.split(',')[1]?.trim() || ""}</small></h2>
                      
                      <span className="artista-destaque">
                        {artistas.find(art => art.id === albumSelecionado.artistaId)?.nome || "Artista desconhecido"}
                      </span>

                      <div className="opcoes-rapidas">
                         <label><input type="checkbox" /> Ouvi em {new Date().toLocaleDateString()}</label>
                         <label><input type="checkbox" /> Já ouvi este antes</label>
                      </div>

                      <textarea placeholder="Adicionar avaliação..."></textarea>

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
                  </div> {}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}