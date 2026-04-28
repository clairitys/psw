import { useNavigate } from 'react-router-dom';
import './style/Cadastro.css';

export function Cadastro({ aoFechar }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('authUser', JSON.stringify({ username: 'novo' }));
    aoFechar?.();
    navigate('/home');
  };

  return (
    <div className="auth-wrapper">
      <div className="overlay" onClick={aoFechar}>
        {/* Ajustado para "cadastro" para alinhar com o seu CSS */}
        <div className="cadastro" onClick={e => e.stopPropagation()}>
          <h2>Criar Conta</h2>
          <form onSubmit={handleSubmit}>
            <input type="text2" placeholder="username" required />
            <input type="email3" placeholder="e-mail" required />
            <input type="password" placeholder="senha" required />
            <button type="submit5" className="submit-button">cadastrar</button>
          </form>
          <button onClick={aoFechar} className="voltar">voltar</button>
        </div>
      </div>
    </div>
  );
}