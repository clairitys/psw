import { Link } from 'react-router-dom';
import './Busca.css';

// Exemplo de como deve estar o seu Busca.jsx
export function Busca({ valor, aoMudar, aoBuscar }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que a página recarregue
    aoBuscar();        // Chama a função de busca do componente pai
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
          <button type="submit">buscar</button>
        </div>
      </form>
    </section>
  );
}