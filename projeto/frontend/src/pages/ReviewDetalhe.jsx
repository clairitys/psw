import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape.jsx';
import { Cadastro } from './Cadastro.jsx';
import './style/ReviewDetalhe.css';

export function ReviewDetalhe() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [erro, setErro] = useState(null);
  const [novoComentario, setNovoComentario] = useState('');
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [jaCurtiu, setJaCurtiu] = useState(false);

  const { albuns, artistas, fetchDados } = useAlbumStore();
  const user = JSON.parse(localStorage.getItem('authUser'));

  const API_URL = `/api/reviews/${id}`;

  const recarregarReview = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`A avaliação com o id "${id}" não foi encontrada no servidor.`);
        }
        return res.json();
      })
      .then((data) => {
        setReview(data);
        setErro(null);
        
        if (data && Array.isArray(data.curtidores) && user && user.username) {
          if (data.curtidores.includes(user.username)) {
            setJaCurtiu(true);
          }
        }
      })
      .catch((err) => {
        console.error("Erro na API de detalhes, tentando busca fallback de segurança...", err);
        
        // FALLBACK: Caso a rota direta falhe devido ao formato do ID, busca a lista completa e filtra
        fetch(`/api/reviews`)
          .then(res => res.json())
          .then(lista => {
            const achado = lista.find(item => String(item.id) === String(id) || String(item._id) === String(id));
            if (achado) {
              setReview(achado);
              setErro(null);
            } else {
              setErro(`A avaliação de ID "${id}" não foi encontrada no sistema.`);
            }
          })
          .catch(() => setErro(err.message));
      });
  };

  useEffect(() => {
    if (fetchDados) fetchDados();
    recarregarReview();
  }, [id]);

  const verificarLoginOuAgir = (acao) => {
    if (!user) {
      setModalCadastroAberto(true);
    } else {
      acao();
    }
  };

  const lidarComCurtida = () => {
    if (!user) {
      setModalCadastroAberto(true);
      return;
    }
    if (jaCurtiu) return;
    
    const novosCurtidores = review?.curtidores ? [...review.curtidores, user.username] : [user.username];
    const novaCurtidaCount = (review?.curtidas || 0) + 1;

    // Tenta atualizar usando a URL padrão ou a chave correta encontrada
    const targetUrl = review.id ? `/api/reviews/${review.id}` : API_URL;

    fetch(targetUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curtidas: novaCurtidaCount, curtidores: novosCurtidores })
    })
    .then(res => res.json())
    .then(() => {
      setJaCurtiu(true);
      recarregarReview();
    });
  };

  const enviarComentario = (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    if (!user) {
      setModalCadastroAberto(true);
      return;
    }

    const targetUrl = review.id ? `/api/reviews/${review.id}/comentarios` : `/api/reviews/${id}/comentarios`;

    fetch(targetUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ texto: novoComentario })
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao enviar comentário');
      return res.json();
    })
    .then(() => {
      setNovoComentario('');
      recarregarReview();
    })
    .catch(err => {
      console.error('Erro ao enviar comentário:', err);
      alert('Erro ao publicar comentário');
    });
  };

  if (erro) {
    return (
      <div className="sua-avaliacao-page">
        <Header />
        <main className="loading-error-container">
          <div>
            <h2>⚠️ Avaliação não encontrada</h2>
            <p>Não foi possível carregar a revisão selecionada.</p>
          </div>
        </main>
        <Rodape />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="sua-avaliacao-page">
        <Header />
        <main className="loading-error-container">
          <p>Carregando dados da avaliação... 🎧</p>
        </main>
        <Rodape />
      </div>
    );
  }

  const safeAlbuns = Array.isArray(albuns) ? albuns : [];
  const safeArtistas = Array.isArray(artistas) ? artistas : [];

  // Mapeia usando tanto review.albumId quanto propriedades diretas do objeto inserido
  const albumDados = safeAlbuns.find(a => String(a.id) === String(review.albumId || review.album?.id));
  const artistaIdDinamico = review.artistaId || albumDados?.artistaId || review.artist?.id;
  const artistaDados = safeArtistas.find(art => String(art.id) === String(artistaIdDinamico));

  const capaFinal = albumDados?.capa || review.album?.capa || review.capa || "img/default.jpg";
  const tituloFinal = albumDados?.titulo || review.album?.titulo || review.titulo || "Álbum";
  const artistaFinal = artistaDados?.nome || review.artist?.nome || review.artista || "Artista";

  return (
    <div className="sua-avaliacao-page">
      <Header />
      
      <main className="conteudo-principal review-detalhe-layout">
        <section className="review-principal-container">
          <div className="review-header-filme">
            <img src={capaFinal.startsWith('img/') ? `/${capaFinal}` : capaFinal} alt={tituloFinal} className="capa-album-review" />
            <div className="review-meta-dados">
              <span className="review-subtitulo-voce">Avaliação de</span>
              <div className="review-user-linha">
                <img src={review.userImg?.startsWith('img/') ? `/${review.userImg}` : (review.userImg || "/img/user.jpg")} alt={review.usuario || review.user?.username} className="avatar-autor" />
                <span className="autor-nome">{review.usuario || review.user?.username || "Anônimo"}</span>
              </div>
              <h1 className="review-titulo-musica">{tituloFinal}</h1>
              <p className="review-artista-nome">por <span className="artist-name">{artistaFinal}</span></p>
              <div className="review-estrelas-grandes">
                {'★'.repeat(Number(review.estrelas || review.rating) || 0)}
              </div>
            </div>
          </div>

          <div className="review-corpo-texto">
            <p className="comentario-texto-exibicao">“{review.comentario || review.comment}”</p>
            <span className="data-publicacao-review">Postado em {review.data || review.createdAt}</span>
          </div>

          <div className="review-acoes-barra">
            <button className={`botao-acao-curtir ${jaCurtiu ? 'curtido' : ''}`} onClick={lidarComCurtida}>
              ❤️ {review.curtidas || 0} curtidas
            </button>
          </div>
        </section>

        <section className="secao-comentarios-letterboxd">
          <h3>Comentários ({review.comentarios?.length || 0})</h3>
          <hr className="linha-divisoria-comentarios" />

          <div className="lista-comentarios">
            {review.comentarios && review.comentarios.length > 0 ? (
              review.comentarios.map((com) => (
                <div key={com._id} className="comentario-item">
                  <img 
                    src={com.user?.avatar?.startsWith('img/') ? `/${com.user.avatar}` : (com.user?.avatar || "/img/user.jpg")} 
                    alt={com.user?.username} 
                    className="comentario-avatar" 
                  />
                  <div className="comentario-conteudo">
                    <div className="comentario-meta">
                      <span className="comentario-autor">{com.user?.username || "Usuário"}</span>
                      <span className="comentario-data">
                        {new Date(com.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="comentario-texto-corpo">{com.texto}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="sem-comentarios">Nenhum comentário ainda.</p>
            )}
          </div>

          <form onSubmit={enviarComentario} className="formulario-comentario">
            <textarea
              placeholder="Adicione um comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              onClick={() => { if (!user) setModalCadastroAberto(true); }}
              className="comment-input"
            />
            <button type="submit" className="save-review-btn">Publicar</button>
          </form>
        </section>
      </main>

      {modalCadastroAberto && <Cadastro aoFechar={() => setModalCadastroAberto(false)} />}
      <Rodape />
    </div>
  );
}