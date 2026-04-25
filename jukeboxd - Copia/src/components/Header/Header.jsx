// Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avaliacao } from '../Avaliacao/Avaliacao.jsx'; // Vamos criar esse
import './Header.css';

export function Header() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <header className="container">
        <h1>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            JukeBoxd
          </Link>
        </h1>
        <nav className="direita">
          <Link to="/entre">entre</Link>
          <Link to="/cadastro">criar conta</Link>
          <a href="#">álbuns</a>
          {/* Botão com evento para abrir o modal */}
          <button className="botao-log" onClick={() => setModalAberto(true)}>
            + Avaliar
          </button>
        </nav>
      </header>

      {/* Se o estado for true, renderiza o modal */}
      {modalAberto && <Avaliacao aoFechar={() => setModalAberto(false)} />}
    </>
  );
}