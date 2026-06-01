import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Cadastro.css';

export function Cadastro({ aoFechar, onLoginSucesso }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Única validação ativa exigida
    if (!username.trim() || !email.trim() || !senha.trim()) {
      alert('Escreva algo no campo');
      return;
    }

    // Cria o objeto do novo usuário sem fazer requisição POST ao banco externo
    const novoUsuarioSimulado = {
      id: Date.now().toString(),
      username: username,
      usuario: username,
      email: email,
      senha: senha,
      pfp: "img/user.jpg"
    };

    // Salva no LocalStorage para persistir o login simulado
    localStorage.setItem('authUser', JSON.stringify(novoUsuarioSimulado));
    
    // Notifica o Header, fecha o modal e redireciona para a Home
    onLoginSucesso?.();
    aoFechar?.();
    navigate('/home');
  };

  return (
    <div className="auth-wrapper">
      <div className="overlay" onClick={aoFechar}>
        <div className="cadastro" onClick={e => e.stopPropagation()}>
          <h2>Criar Conta</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text1" 
              placeholder="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <input 
              type="email1" 
              placeholder="e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password1" 
              placeholder="senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required 
            />
            <button type="submit" className="enviar">cadastrar</button>
          </form>
          <button onClick={aoFechar} className="voltar">voltar</button>
        </div>
      </div>
    </div>
  );
}