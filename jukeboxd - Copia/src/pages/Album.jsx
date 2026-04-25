import React, { useEffect, useState } from 'react'; // Adicionado useState
import { useParams, Link } from 'react-router-dom';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import { Busca } from '../components/Busca/Busca';
import './style/Album.css'; 

export function Album() {
  const { id } = useParams(); 
  const { albuns, artistas, musicas, fetchDados } = useAlbumStore();

  // --- ESTADOS PARA A BUSCA ---
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // Reseta a busca se o input for limpo
  useEffect(() => {
    if (termo === '') setTermoAtivo('');
  }, [termo]);

  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  // --- LÓGICA DE FILTRO ---
  const listaSegura = Array.isArray(albuns) ? albuns : [];
  const resultadosBusca = (termoAtivo.trim().length >= 2) 
    ? listaSegura.filter(a => {
        const termoLongo = termoAtivo.toLowerCase();
        const combinaTitulo = a.titulo?.toLowerCase().includes(termoLongo);
        const dadosArt = artistas.find(art => art.id === a.artistaId);
        const combinaArtista = dadosArt?.nome?.toLowerCase().includes(termoLongo);
        return combinaTitulo || combinaArtista;
      }) 
    : [];

  const albumAtual = albuns.find(a => String(a.id) === String(id));
  const artistaAtual = artistas.find(art => art.id === albumAtual?.artistaId);
  const musicasDoAlbum = musicas.filter(m => String(m.albumId) === String(id));

  if (albuns.length === 0 || (!albumAtual && termoAtivo === '')) {
    return <div className="carregando">Carregando dados...</div>;
  }

  return (
    <div className="album-page-wrapper">
      <Header />
      
      <main className="container2">
        {}
        <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />
      </main>

      <div className="container3">
       
      {termoAtivo.length > 0 ? (
        <section className="resultados-container"> {}
          <h2>Resultados para "{termoAtivo}"</h2>
          <div className="cards-busca">
            {resultadosBusca.map(res => (
              <Link to={`/album/${res.id}`} key={res.id} className="album-card-link" onClick={() => setTermoAtivo('')}>
                <div className="album-card-busca">
                  {}
                  <div className="capa-container">
                      <img src={`/${res.capa}`} alt={res.titulo} />
                  </div>
                  <div className="info-album">
                      <h3>{res.titulo}</h3>
                      {}
                      <p>{artistas?.find(art => String(art.id) === String(res.artistaId))?.nome || 'Artista desconhecido'}</p>
                      <span className="data-lancamento">{res.data}</span>
                  </div>
                </div>
              </Link>
            ))}
            {resultadosBusca.length === 0 && <p className="sem-resultado">Nenhum resultado encontrado.</p>}
          </div>
        </section>
      ) : (
          <div className="review-card">
            <div className="album-header">
              <img src={`/${albumAtual.capa}`} alt={albumAtual.titulo} className="album-cover" />

              <div className="album-details">
                <div className="tabela">
                  <h1 className="album-title">{albumAtual.titulo}</h1>
                  <div className="global-rating">
                    <img src="/img/star.png" alt="Estrela" className="star-icon" />
                    <span className="rating-score">4.2 (4.3B)</span>
                  </div>
                </div>

                <p className="album-artist">
                  por <Link to={`/artista/${artistaAtual?.id}`}>
                    <span className="artist-name">{artistaAtual?.nome || albumAtual.artista}</span>
                  </Link>
                </p>

                <div className="info">
                  <p>Publicado {albumAtual.data}</p>
                  <p>{musicasDoAlbum.length} Músicas</p>
                </div>    
                
                <div className="info2">
                  <p><strong>Gênero(s):</strong> {Array.isArray(albumAtual.generos) ? albumAtual.generos.join(', ') : albumAtual.generos}</p>
                  <p><strong>Gravadora:</strong> {albumAtual.gravadora}</p>
                </div>
              </div>
            </div>

            <div className="album">     
              {musicasDoAlbum.map((musica) => (
                <div key={musica.id} className="musica">
                  <span className="numero">{musica.numero}</span>
                  <span className="titulo">{musica.titulo}</span>
                  <span className="tempo">{musica.tempo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Rodape />
    </div>
  );
}