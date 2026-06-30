import { useState, useEffect } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import { getEntityId } from '../../utils/ids';
import './CardAvaliacao.css';

const BASE_URL_BACKEND = "http://localhost:5000";

export function CardAvaliacao({ id, _id, album, artist, rating, comment, user, createdAt, capa }) {
  const [loading, setLoading] = useState(false);
  const [capaInjetada, setCapaInjetada] = useState(null); // Estado para guardar a capa encontrada
  const { removerReview } = useAlbumStore();
  const currentUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  const reviewId = getEntityId({ id, _id });

  const isAuthor = currentUser && user && (
    getEntityId(currentUser) === getEntityId(user) ||
    currentUser.username === user.username
  );

  // 🌟 BUSCA BLINDADA DA CAPA VIA API
  useEffect(() => {
    // Se a review já veio com uma capa válida do banco, usamos ela direto
    if (capa && capa !== "undefined" && capa !== "null" && capa.trim() !== "") {
      setCapaInjetada(capa);
      return;
    }

    // Se veio sem capa, fazemos uma busca na sua rota de álbuns usando o nome do álbum
    const buscarCapaDoAlbum = async () => {
      try {
        const resposta = await fetch(`${BASE_URL_BACKEND}/api/albuns`); // Ajuste o "/api/albuns" se sua rota de álbuns for diferente
        if (!resposta.ok) return;
        
        const listaAlbuns = await resposta.json();
        const encontrado = listaAlbuns.find(
          (a) => (a.titulo || '').toLowerCase().trim() === (album || '').toLowerCase().trim()
        );

        if (encontrado && encontrado.capa) {
          setCapaInjetada(encontrado.capa);
        }
      } catch (err) {
        console.error("Erro ao buscar capa dinamicamente:", err);
      }
    };

    buscarCapaDoAlbum();
  }, [album, capa]);

  const handleDelete = async (e) => {
    e.stopPropagation(); 
    if (!window.confirm('Tem certeza que deseja deletar esta avaliação?')) return;

    setLoading(true);
    try {
      await removerReview(reviewId);
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      alert('Erro ao deletar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    for (let i = fullStars; i < 5; i++) stars += '☆';
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Data inválida';
    }
  };

  // --- MONTAGEM FINAL DA URL DA CAPA ---
  let capaUrl = "/img/default-album.jpg"; 

  if (capaInjetada) {
    if (capaInjetada.startsWith("http")) {
      capaUrl = capaInjetada;
    } else {
      const caminhoLimpo = capaInjetada.startsWith("/") ? capaInjetada : `/${capaInjetada}`;
      capaUrl = `${BASE_URL_BACKEND}${caminhoLimpo}`;
    }
  }

  // --- TRATAMENTO DO AVATAR ---
  let avatarUrl = "/img/user.jpg";
  if (user?.avatar) {
    if (user.avatar.startsWith("http")) {
      avatarUrl = user.avatar;
    } else {
      const avatarLimpo = user.avatar.startsWith("/") ? user.avatar : `/${user.avatar}`;
      avatarUrl = `${BASE_URL_BACKEND}${avatarLimpo}`;
    }
  }

  return (
    <div className="avCT">
      {isAuthor && (
        <button className="btn-delete-review" onClick={handleDelete} disabled={loading}>
          {loading ? '...' : '✕'}
        </button>
      )}

      <img 
        src={capaUrl} 
        className="img1" 
        alt="Capa do Álbum" 
        onError={(e) => { 
          e.target.src = "/img/default-album.jpg"; 
        }} 
      />
      
      <div className="info">
        <h1>{album}</h1>
        <span className="subtitulo">{artist}</span>
        
        <div className="user">
          <img 
            src={avatarUrl} 
            className="img2" 
            alt="User"
            onError={(e) => { e.target.src = '/img/user.jpg'; }}
          />
          <span className="usuario">{user?.username || user?.name || 'Usuário desconhecido'}</span>
          <div className="stars">{renderStars(rating)}</div>
        </div>

        {comment && <p className="comentario">{comment}</p>}
        <span className="data">Avaliado em: {formatDate(createdAt)}</span>
      </div>
    </div>
  );
}