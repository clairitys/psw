import { useState, useEffect } from 'react';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header';
import './style/Admin.css';

export function Admin() {
  // AJUSTE: Mudamos fetchAlbuns para fetchDados
  const { albuns, fetchDados, adicionarAlbum, removerAlbum } = useAlbumStore();
  const [novo, setNovo] = useState({ titulo: '', artista: '', capa: '', data: '' });

  // AJUSTE: Chamamos fetchDados aqui também
  useEffect(() => { 
    if (fetchDados) fetchDados(); 
  }, [fetchDados]);

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarAlbum({ ...novo, id: Date.now().toString() });
    setNovo({ titulo: '', artista: '', capa: '', data: '' });
  };

  // SEGURANÇA: Se albuns ainda não carregou, não deixa o .map quebrar
  if (!Array.isArray(albuns)) return <p>Carregando catálogo...</p>;

  return (
    <div className="admin-page">
      <Header />
      <main style={{ padding: '2rem', marginTop: '80px', color: 'black' }}>
        <h2>Painel Administrativo 🛠️</h2>
        
        <section className="form-admin">
          <h3>Cadastrar Novo Álbum</h3>
          <form onSubmit={handleSubmit}>
            <input placeholder="Título" value={novo.titulo} onChange={e => setNovo({...novo, titulo: e.target.value})} />
            <input placeholder="Artista" value={novo.artista} onChange={e => setNovo({...novo, artista: e.target.value})} />
            <button type="submit">Adicionar ao Catálogo</button>
          </form>
        </section>

        <section className="lista-admin">
          <h3>Gestão de Registros </h3>
          {albuns.map(album => (
            <div key={album.id} className="admin-item" style={{ marginBottom: '10px' }}>
              <span>{album.titulo} - {album.artista} </span>
              <button onClick={() => removerAlbum(album.id)} style={{ color: 'red', marginLeft: '10px' }}>Remover </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}