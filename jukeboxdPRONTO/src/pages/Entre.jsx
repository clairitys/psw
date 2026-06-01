import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Entre.css';

export function Entre({ aoFechar, onLoginSucesso }) {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Única validação ativa exigida
    if (!usernameInput.trim() || !senhaInput.trim()) {
      alert('Escreva algo no campo');
      return;
    }

    // Cria um objeto de usuário estático (sem banco de dados) para o sistema funcionar
    const usuarioSimulado = {
      id: "999",
      username: usernameInput,
      usuario: usernameInput,
      email: `${usernameInput}@teste.com`,
      pfp: "img/user.jpg"
    };

    // Salva no LocalStorage para a Home e o Header saberem quem logou
    localStorage.setItem('authUser', JSON.stringify(usuarioSimulado));
    
    // Executa as funções de fechar o modal, atualizar o Header e ir para a Home
    onLoginSucesso?.(); 
    aoFechar?.();           
    navigate('/home');           
  };

  return (
    <div className="auth-wrapper2">
      <div className="overlay2" onClick={aoFechar}>
        <div className="entrar2" onClick={e => e.stopPropagation()}>
          <h2>Bem vindo de volta!</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text2" 
              placeholder="username" 
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required 
            />
            <input 
              type="password2" 
              placeholder="senha" 
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              required 
            />
            <button type="submit" className="submit-button1">entrar</button>
          </form>
          <button onClick={aoFechar} className="voltar2">voltar</button>
        </div>
      </div>
    </div>
  );
}