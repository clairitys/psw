import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ArtistCard.module.css';
import { formatAvatarUrl } from '../../utils/format';

export function ArtistCard({ artista }) {
  const foto = formatAvatarUrl(artista?.foto, '/img/user.jpg');
  return (
    <Link to={`/artista/${artista.id}`} className={styles.artistCard}>
      <div className={styles.body}>
        <img className={styles.img} src={foto} alt={artista.nome} />
        <div className={styles.info}>
          <h3>{artista.nome}</h3>
          <p>{artista.bio || 'Sem biografia disponível'}</p>
          <span>{artista.albumCount ?? 0} álbuns</span>
        </div>
      </div>
    </Link>
  );
}

export default ArtistCard;
