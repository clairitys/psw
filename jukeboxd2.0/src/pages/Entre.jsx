// Entre.jsx
import { useNavigate } from 'react-router-dom';
import './style/Entre.css';

export function Entre({ aoFechar }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // aqui você faria a autenticação real (fetch/axios)
    // se ok, marca como logado
    localStorage.setItem('authUser', JSON.stringify({ username: 'usuario' }));
    aoFechar?.();            // fecha modal se vier por prop
    navigate('/home');           // vai para Home
  };

  return (
    <div className="auth-wrapper">
      <div className="overlay" onClick={aoFechar}>
        <div className="entrar" onClick={e => e.stopPropagation()}>
          <h2>Bem vindo de volta! ⋆˙⟡</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" />
            <input type="password" placeholder="senha" />
            <button type="submit" className="submit-button">entrar</button>
          </form>
          <button onClick={aoFechar} className="voltar">voltar</button>
        </div>
      </div>
    </div>
  );
}
