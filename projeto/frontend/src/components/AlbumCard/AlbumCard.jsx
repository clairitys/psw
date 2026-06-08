import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AlbumCard.module.css';
import { formatCapaUrl } from '../../utils/format';

export function AlbumCard({ album }) {
  const capa = formatCapaUrl(album?.capa);
  const albumId = album?.id || album?._id;

  return (
    <Link key={albumId} to={`/album/${albumId}`} className={styles.albumCard}>
      <div className={styles.capa}>
        <img src={capa} alt={album?.titulo || 'Capa de álbum'} />
      </div>
      <div className={styles.info}>
        <h3>{album?.titulo}</h3>
        <p className="data-lancamento">{album?.data || ''}</p>
      </div>
    </Link>
  );
}

export default AlbumCard;
