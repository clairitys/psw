import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="container">
      <h1>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          JukeBoxd
        </Link>
      </h1>
      <nav className="direita">
        <Link to="/entre">entre</Link>
        <Link to="/cadastro">criar conta</Link>
        <a href="#">músicas</a>
        <a href="#">álbuns</a>
        <a href="#">gêneros</a>
      </nav>
    </header>
  );
}