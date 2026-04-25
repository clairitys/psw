import { Link } from 'react-router-dom';
import './style/Entre.css';

export function Entre() {
  return (
    <div className="auth-wrapper">
      
      <div className="overlay">
        <div className="entrar">
          <h2>Bem vindo de volta! ⋆˙⟡</h2>
          <form>
            <input type="text" placeholder="username" />
            <input type="password" placeholder="senha" />
            <button type="submit" className="submit-button">entrar</button>
          </form>
          <Link to="/" className="voltar">voltar para a home</Link>
        </div>
      </div>
    </div>
  );
}