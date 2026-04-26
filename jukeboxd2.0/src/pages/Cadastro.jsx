// Cadastro.jsx
import { useNavigate } from 'react-router-dom';
import './style/Cadastro.css';

export function Cadastro({ aoFechar }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // enviar dados de cadastro para API, criar usuário...
    localStorage.setItem('authUser', JSON.stringify({ username: 'novo' }));
    aoFechar?.();
    navigate('/home');
  };

  return (
    <div className="auth-wrapper">
      <div className="overlay" onClick={aoFechar}>
        <div className="entrar" onClick={e => e.stopPropagation()}>
          <h2>Criar Conta</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" />
            <input type="email" placeholder="e-mail" />
            <input type="password" placeholder="senha" />
            <button type="submit" className="submit-button">cadastrar</button>
          </form>
          <button onClick={aoFechar} className="voltar">voltar</button>
        </div>
      </div>
    </div>
  );
}
