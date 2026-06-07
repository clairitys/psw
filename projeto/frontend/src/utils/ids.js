/** Normaliza id de entidades vindas da API (Mongo id / _id). */
export function getEntityId(entity) {
  if (entity == null) return '';
  if (typeof entity === 'string' || typeof entity === 'number') return String(entity);
  return String(entity.id ?? entity._id ?? '');
}

/** ID do artista referenciado por um álbum (populado ou ObjectId). */
export function getAlbumArtistaId(album) {
  if (!album?.artistaId) return '';
  return getEntityId(album.artistaId);
}

export function findArtistaForAlbum(artistas, album) {
  const artistaId = getAlbumArtistaId(album);
  if (!artistaId) return null;
  return artistas.find((art) => getEntityId(art) === artistaId) ?? null;
}

export function albumMatchesArtista(album, artistaId) {
  return getAlbumArtistaId(album) === String(artistaId);
}

export function albumMatchesId(album, albumId) {
  return getEntityId(album) === String(albumId);
}
