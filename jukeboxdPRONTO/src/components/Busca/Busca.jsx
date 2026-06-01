import { Link } from 'react-router-dom';
import './Busca.css';

export function Busca({ valor, aoMudar, aoBuscar }) {
  const handleSubmit = (e) => {
    e.preventDefault(); 
    aoBuscar();        
  };

  return (
    <section className="container4">
      <form className="busca1" onSubmit={handleSubmit}>
        <div className="barra1">
          <input 
            type="text1" 
            placeholder="Pesquisar..." 
            value={valor}
            onChange={(e) => aoMudar(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            {/* Apenas o ícone da lupa, sem alterar as tags */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}