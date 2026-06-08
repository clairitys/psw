import { useState } from 'react';
import { useAlbumStore } from '../../store/useAlbumStore';
import { getEntityId } from '../../utils/ids';
import './CardAvaliacao.css';

export function CardAvaliacao({ id, _id, album, artist, rating, comment, user, createdAt, capa }) {
  const [loading, setLoading] = useState(false);
  const { removerReview } = useAlbumStore();
  const currentUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  const reviewId = getEntityId({ id, _id });

  const isAuthor = currentUser && user && (
    getEntityId(currentUser) === getEntityId(user) ||
    currentUser.username === user.username
  );

  const handleDelete = async (e) => {
    // Evita que o clique no botão abra algum link do card caso haja links em volta
    e.stopPropagation(); 
    
    if (!window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      return;
    }

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
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    for (let i = fullStars; i < 5; i++) {
      stars += '☆';
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return 'Data inválida';
    }
  };

  // Define um fallback caso o objeto review traga um campo específico de capa ou use um padrão
  const capaUrl = capa || user?.albumCapa || "/img/default-album.jpg";

  return (
    <div className="avCT">
      {/* Botão flutuante de deletar exclusivo do autor */}
      {isAuthor && (
        <button 
          className="btn-delete-review"
          onClick={handleDelete}
          disabled={loading}
          title="Deletar esta avaliação"
        >
          {loading ? '...' : '✕'}
        </button>
      )}

      <img src={capaUrl} className="img1" alt="Capa do Álbum" onError={(e) => { e.target.src = "/img/default-album.jpg" }} />
      
      <div className="info">
        <h1>{album}</h1>
        <span className="subtitulo">{artist}</span>
        
        <div className="user">
          <img 
            src={user?.avatar || "/img/user.jpg"} 
            className="img2" 
            alt="User"
            onError={(e) => { e.target.src = '/img/user.jpg' }}
          />
          <span className="usuario">{user?.username || user?.name || 'Usuário desconhecido'}</span>
          <div className="stars">{renderStars(rating)}</div>
        </div>

        {comment && (
          <p className="comentario">{comment}</p>
        )}
        
        <span className="data">Avaliado em: {formatDate(createdAt)}</span>
      </div>
    </div>
  );
}