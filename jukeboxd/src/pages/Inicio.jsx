import { useAlbumStore } from '../store/useAlbumStore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape.jsx';
import { CardAvaliacao } from '../components/CardAvaliacao/CardAvaliacao.jsx';
import { Busca } from '../components/Busca/Busca';
import './style/Inicio.css';

export function Inicio() {
  const [termo, setTermo] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');

  // 1. Pegamos os dados da Store Global
  const { albuns, fetchDados } = useAlbumStore();

  // 2. Carrega os dados do JSON Server ao montar a página
  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // 3. Monitora o input: se o usuário apagar tudo, a busca reseta
  useEffect(() => {
    if (termo === '') {
      setTermoAtivo('');
    }
  }, [termo]);

  // 4. Função que dispara a busca (apenas uma vez!)
  const lidarComBusca = () => {
    setTermoAtivo(termo.trim());
  };

  // 5. Filtro unificado e seguro
 const listaSegura = Array.isArray(albuns) ? albuns : [];
  
  const resultadosBusca = (termoAtivo.trim().length >= 2) 
  ? listaSegura.filter(a => 
      (a.titulo?.toLowerCase().includes(termoAtivo.toLowerCase())) || 
      (a.artista?.toLowerCase().includes(termoAtivo.toLowerCase()))
    ) 
  : [];

  return (
    <div className="home-container">
      <Header />

      <Busca valor={termo} aoMudar={setTermo} aoBuscar={lidarComBusca} />

      <main className="conteudo-principal">
        
        {termoAtivo.length > 0 ? (
          <section className="resultados-container">
            <h2>Resultados para "{termoAtivo}"</h2>
            <div className="cards-busca">
              {resultadosBusca.length > 0 ? (
                resultadosBusca.map(album => (
                  <div key={album.id} className="album-card-busca">
                    <div className="capa-container">
                      <img src={album.capa} alt={album.titulo} />
                    </div>
                    <div className="info-album">
                      <div className="titulo-linha">
                        <h3>{album.titulo}</h3>
                        <span className="data-lancamento">{album.data}</span>
                      </div>
                      <p>{album.artista}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum álbum ou artista encontrado.</p>
              )}
            </div>
          </section>
        ) : (
          <>
            <p className="texto-chamada">
              Avalie as músicas e álbuns que você já ouviu.<br />
              Salve aquilo que você quer ouvir ★ˎˊ˗<br />
              Compartilhe com seus amigos o que é bom.
            </p>

            <div className="Cbotão">
              <Link to="/cadastro" className="botão">Comece Já</Link>
            </div>

            <div className="albuns">
              {listaSegura.length > 0 ? (
                listaSegura.slice(0, 11).map((album) => (
                  <img 
                    key={album.id} 
                    src={album.capa} 
                    className="img" 
                    alt={album.titulo} 
                    title={`${album.titulo} - ${album.artista}`}
                  />
                ))
              ) : (
                <p>A carregar álbuns maravilhosos... 🎧</p>
              )}
            </div>

            <p className="texto-chamada">Escreva suas avaliações e compartilhe com os outros! ⭒˚.⋆</p>

            <section className="avaliações">
              <h2>Principais avaliações da semana</h2>
              <hr />
              <div className="cards">
                <CardAvaliacao 
                  capa="img/beatles.jpg"
                  titulo="Abbey Road"
                  artista="The Beatles"
                  userImg="img/user.jpg"
                  username="beatleMania"
                  estrelas="★★★★★"
                  comentario="Melhor forma de encerramento de banda possível."
                  data="15/03/2026"
                />
                <CardAvaliacao 
                  capa="img/justin.jpg"
                  titulo="Believe"
                  artista="Justin Bieber"
                  userImg="img/icon.jpg"
                  username="belieBers"
                  estrelas="★★★★★"
                  comentario="O melhor álbum da carreira dele."
                  data="15/03/2026"
                />
              </div>
            </section>
          </>
        )}
      </main>

      <Rodape />
    </div>
  );
}