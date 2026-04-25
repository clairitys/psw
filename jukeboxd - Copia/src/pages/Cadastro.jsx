import { Link } from 'react-router-dom';
import './style/Cadastro.css';

export function Cadastro() {
  return (
    <div className="auth-wrapper">
      
      <div className="overlay">
        <div className="cadastro">
          <h2>Criar Conta</h2>
          <form>
            <input type="text" placeholder="username" />
            <input type="email" placeholder="e-mail" />
            <input type="password" placeholder="senha" />
            <button type="submit" className="submit-button">cadastrar</button>
          </form>
          <Link to="/" className="voltar">voltar para a home</Link>
        </div>
      </div>
    </div>
  );
}