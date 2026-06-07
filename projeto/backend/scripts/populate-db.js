const fetch = globalThis.fetch || require('node-fetch');

const BASE = 'http://localhost:3001/api';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWIyMWZkMWFjNWE5YTY4ZWFiOGMwMCIsImlhdCI6MTc4MDI0NTA5MCwiZXhwIjoxNzgwMjczODkwfQ.3crIZLQvvxnEksfTOMSnKQOadpmhQUF21koa-gtFfUU';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, options);
  const text = await res.text();
  let body = text;
  try { body = JSON.parse(text); } catch (_) {}
  return { status: res.status, ok: res.ok, body };
}

async function post(path, data, token) {
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
}

async function put(path, data, token) {
  return request(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
}

async function del(path, token) {
  return request(path, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

async function get(path, token) {
  return request(path, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

(async () => {
  try {
    const now = Date.now();
    const users = [
      { username: `testeuser1${now}`, email: `testeuser1${now}@example.com`, password: 'Senha123' },
      { username: `testeuser2${now}`, email: `testeuser2${now}@example.com`, password: 'Senha123' },
    ];

    const createdUsers = [];
    for (const user of users) {
      const res = await post('/auth/signup', user);
      console.log('SIGNUP', user.username, res.status, res.body);
      if (!res.ok) throw new Error(`Falha ao criar ${user.username}`);
      createdUsers.push(user);
    }

    const logins = [];
    for (const user of createdUsers) {
      const res = await post('/auth/login', { email: user.email, password: user.password });
      console.log('LOGIN', user.username, res.status, res.body);
      if (!res.ok) throw new Error(`Falha ao logar ${user.username}`);
      logins.push({ ...user, token: res.body.token, id: res.body.user.id });
    }

    const artists = [
      { nome: 'Artista Pop Teste', bio: 'Bio Pop' },
      { nome: 'Artista Rock Teste', bio: 'Bio Rock' },
      { nome: 'Artista Jazz Teste', bio: 'Bio Jazz' },
    ];
    const createdArtists = [];
    for (const artist of artists) {
      const res = await post('/artistas', artist, ADMIN_TOKEN);
      console.log('CREATE ARTIST', artist.nome, res.status, res.body);
      if (!res.ok) throw new Error(`Falha ao criar artista ${artist.nome}`);
      createdArtists.push(res.body);
    }

    const albums = [
      { titulo: 'Album 1 Teste', artistaId: createdArtists[0]._id || createdArtists[0].id, data: '2026', generos: ['Pop'], gravadora: 'Independente' },
      { titulo: 'Album 2 Teste', artistaId: createdArtists[1]._id || createdArtists[1].id, data: '2025', generos: ['Rock'], gravadora: 'Teste Records' },
    ];
    const createdAlbums = [];
    for (const album of albums) {
      const res = await post('/albuns', album, ADMIN_TOKEN);
      console.log('CREATE ALBUM', album.titulo, res.status, res.body);
      if (!res.ok) throw new Error(`Falha ao criar album ${album.titulo}`);
      createdAlbums.push(res.body);
    }

    const songs = [
      { numero: 1, titulo: 'Faixa 1 Teste', tempo: '3:30', albumId: createdAlbums[0]._id || createdAlbums[0].id },
      { numero: 2, titulo: 'Faixa 2 Teste', tempo: '4:00', albumId: createdAlbums[0]._id || createdAlbums[0].id },
      { numero: 1, titulo: 'Rock 1 Teste', tempo: '3:50', albumId: createdAlbums[1]._id || createdAlbums[1].id },
    ];
    const createdSongs = [];
    for (const song of songs) {
      const res = await post('/musicas', song, ADMIN_TOKEN);
      console.log('CREATE SONG', song.titulo, res.status, res.body);
      if (!res.ok) throw new Error(`Falha ao criar música ${song.titulo}`);
      createdSongs.push(res.body);
    }

    const reviews = [
      { album: 'Album 1 Teste', artist: 'Artista Pop Teste', rating: 5, comment: 'Top!' },
      { album: 'Album 1 Teste', artist: 'Artista Pop Teste', rating: 4, comment: 'Muito bom!' },
      { album: 'Album 2 Teste', artist: 'Artista Rock Teste', rating: 3, comment: 'Bom para ouvir.' },
    ];
    const createdReviews = [];
    for (const [index, review] of reviews.entries()) {
      const token = logins[index % logins.length].token;
      const res = await post('/reviews', review, token);
      console.log('CREATE REVIEW', review.album, res.status, res.body);
      if (!res.ok) throw new Error(`Falha ao criar review ${review.album}`);
      createdReviews.push(res.body);
    }

    console.log('População concluída com sucesso.');
    console.log('Admin token usado:', ADMIN_TOKEN);
    console.log('Usuários criados:', logins.map(u => ({ username: u.username, id: u.id })));
    console.log('Artistas criados:', createdArtists.map(a => ({ nome: a.nome, id: a._id || a.id })));
    console.log('Álbuns criados:', createdAlbums.map(a => ({ titulo: a.titulo, id: a._id || a.id })));
    console.log('Músicas criadas:', createdSongs.map(m => ({ titulo: m.titulo, id: m._id || m.id })));
    console.log('Reviews criadas:', createdReviews.map(r => ({ album: r.album, id: r._id || r.id })));
  } catch (error) {
    console.error('Erro no script:', error);
    process.exit(1);
  }
})();
