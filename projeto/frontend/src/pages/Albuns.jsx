import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { findArtistaForAlbum, getEntityId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import './style/Albuns.css';

export function Albuns() {
  const { albuns, artistas, fetchDados } = useAlbumStore();
  const [searchParams] = useSearchParams();
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState(searchParams.get('genero') || '');

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    const generoParam = searchParams.get('genero');
    if (generoParam) setFiltro(generoParam);
    const artistaParam = searchParams.get('artista');
    if (artistaParam) setTermo('');
  }, [searchParams]);

  const generosDisponiveis = useMemo(() => {
    const set = new Set();
    albuns.forEach((a) => {
      if (Array.isArray(a.generos)) a.generos.forEach((g) => set.add(g));
    });
    return Array.from(set).sort();
  }, [albuns]);

  const artistaFiltroId = searchParams.get('artista');

  const resultados = albuns
    .filter((album) => {
      const texto = termo.toLowerCase();
      const artista = findArtistaForAlbum(artistas, album);
      return (
        album.titulo?.toLowerCase().includes(texto) ||
        artista?.nome?.toLowerCase().includes(texto) ||
        (Array.isArray(album.generos)
          ? album.generos.join(', ').toLowerCase().includes(texto)
          : String(album.generos || '').toLowerCase().includes(texto))
      );
    })
    .filter((album) => {
      if (artistaFiltroId && getEntityId(findArtistaForAlbum(artistas, album)) !== artistaFiltroId) {
        return false;
      }
      if (!filtro) return true;
      return Array.isArray(album.generos)
        ? album.generos.includes(filtro)
        : String(album.generos || '').toLowerCase().includes(filtro.toLowerCase());
    });

  return (
    <div className="home-container">
      <Header />
      <main className="albuns-content container3">
        <h1 className="albuns-title">Catálogo de Álbuns 💿</h1>
        <div className="albuns-actions">
          <input
            type="text"
            placeholder="Buscar álbum, artista ou gênero"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="albuns-search"
          />
          <select className="albuns-filter" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos os gêneros</option>
            {generosDisponiveis.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="albuns-grid">
          {resultados.length === 0 ? (
            <p className="albuns-empty">Nenhum álbum encontrado.</p>
          ) : (
            resultados.map((album) => {
              const artista = findArtistaForAlbum(artistas, album);
              return (
                <Link key={getEntityId(album)} to={`/album/${getEntityId(album)}`} className="album-card">
                  <img src={formatCapaUrl(album.capa)} alt={album.titulo} />
                  <div className="album-card-info">
                    <h3>{album.titulo}</h3>
                    <span>{artista?.nome || 'Artista desconhecido'}</span>
                    <small>
                      {Array.isArray(album.generos) ? album.generos.join(', ') : album.generos || 'Sem gênero'}
                    </small>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
      <Rodape />
    </div>
  );
}
