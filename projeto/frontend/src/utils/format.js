export function formatCapaUrl(capa, fallback = '/img/default-album.jpg') {
  if (!capa) return fallback;
  if (capa.startsWith('http') || capa.startsWith('/')) return capa;
  return `/${capa}`;
}

export function formatAvatarUrl(avatar, fallback = '/img/user.jpg') {
  return formatCapaUrl(avatar, fallback);
}
