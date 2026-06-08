import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape';
import { useAlbumStore } from '../store/useAlbumStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style/Generos.css';

export function Generos() {
  const { generos, fetchGeneros } = useAlbumStore();

  useEffect(() => {
    fetchGeneros();
  }, [fetchGeneros]);

  return (
    <div className="journal-page-wrapper">
      <Header />
      
      {/* SEÇÃO HERO/DESTAQUE PRINCIPAL */}
      <section className="journal-hero-banner">
        <div className="journal-hero-container">
          
          {/* Lado Esquerdo: Imagem Conceitual de História da Música */}
          <div className="journal-hero-image-wrapper">
            <img 
              src="public/img/snoopy.jpg" 
              alt="História da Música" 
              className="journal-hero-image"
            />
          </div>

          {/* Lado Direito: Texto Editorial Estático */}
          <div className="journal-hero-content">
            <span className="journal-editorial-tag">Gêneros Musicais</span>
            <h1 className="journal-hero-title">A Linguagem dos Gêneros.</h1>
            <p className="journal-hero-lead">
              A música é uma das formas mais puras de expressão humana, capaz de transcender barreiras históricas e culturais. 
              Por trás de cada melodia, os gêneros musicais funcionam como bússolas artísticas: eles categorizam evoluções rítmicas, 
              movimentos sociais e identidades de épocas inteiras.
            </p>
            <p className="journal-hero-paragraph">
              Dos lamentos profundos do Blues às batidas sintéticas do Eletrônico, explorar diferentes estilos é mergulhar 
              diretamente na história da nossa própria criatividade. Descubra abaixo as ramificações que moldam nossos ouvidos.
            </p>
          </div>

        </div>
      </section>

      {/* SEÇÃO DA GRADE DE GÊNEROS */}
      <main className="journal-feed-section">
        <div className="journal-feed-container">
          
          {generos.length === 0 ? (
            <p className="journal-empty-state">Nenhum gênero disponível no momento.</p>
          ) : (
            <div className="journal-grid-feed">
              {generos.map((g) => (
                <Link 
                  to={`/albuns?genero=${encodeURIComponent(g.nome)}`} 
                  key={g.id || g._id} 
                  className="journal-article-card"
                >
                  {/* Imagem do Gênero */}
                  <div className="journal-card-image-box">
                    <img 
                      src={g.imagemUrl || "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=600&auto=format&fit=crop"} 
                      alt={g.nome} 
                      className="journal-card-image"
                    />
                  </div>

                  {/* Detalhes do Gênero */}
                  <div className="journal-card-meta">
                    <span className="journal-card-tag">Gênero Musical</span>
                  </div>
                  
                  <h3 className="journal-card-title">{g.nome}</h3>
                  
                  <p className="journal-card-excerpt">
                    {g.descricao || 'Este gênero possui uma história rica em ritmo, cultura e expressão artística.'}
                  </p>
                  
                  {/* CTA Estruturado com span */}
                  <div className="journal-card-footer-wrapper">
                    <span className="journal-card-btn-cta">
                      Explorar Gênero
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>

      <Rodape />
    </div>
  );
}