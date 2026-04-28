import { useNavigate } from 'react-router-dom';
import './style/Entre.css';

export function Entre({ aoFechar }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('authUser', JSON.stringify({ username: 'usuario' }));
    aoFechar?.();           
    navigate('/home');           
  };

  return (
    <div className="auth-wrapper2">
      <div className="overlay2" onClick={aoFechar}>
        <div className="entrar2" onClick={e => e.stopPropagation()}>
          <h2>Bem vindo de volta! ⋆˙⟡</h2>
          <form onSubmit={handleSubmit}>
            <input type="text2" placeholder="username" required />
            <input type="password" placeholder="senha" required />
            <button type="submit2" className="submit-button1">entrar</button>
          </form>
          <button onClick={aoFechar} className="voltar2">voltar</button>
        </div>
      </div>
    </div>
  );
}