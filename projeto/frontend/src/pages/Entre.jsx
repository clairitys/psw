// Entre.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maskEmail } from '../utils/masks';
import { isValidEmail, isValidPassword } from '../utils/validators';
import './style/Entre.css';

export function Entre({ aoFechar }) {
  const navigate = useNavigate();

  const [identificador, setIdentificador] = useState(''); 
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleIdentificadorChange = (e) => {
    const value = e.target.value.trim();
    setIdentificador(value);
    if (errors.identificador) {
      setErrors(prev => ({
        ...prev,
        identificador: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!identificador) {
      newErrors.identificador = 'Username ou email é obrigatório';
    } else {
      // Se tem @, validar como email
      if (identificador.includes('@')) {
        if (!isValidEmail(identificador)) {
          newErrors.identificador = 'Email inválido';
        }
      } else {
        // Se não tem @, validar como username (mínimo 3 caracteres)
        if (identificador.length < 3) {
          newErrors.identificador = 'Username deve ter no mínimo 3 caracteres';
        }
      }
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Verifica se o usuário digitou um email (se tem @) ou um username
      const isEmail = identificador.includes('@');
      const dadosParaEnviar = isEmail 
        ? { email: identificador, password: password }
        : { username: identificador, password: password };

      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Sucesso! Salvando os dados no navegador para o site saber que estamos logados
        const user = { ...dados.user, id: dados.user?.id || dados.user?._id };
        localStorage.setItem('token', dados.token);
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user));
        
        alert('Login realizado com sucesso!');
        aoFechar?.(); 
        navigate('/home'); // Manda para a página inicial logada
      } else {
        setErrors({ form: dados.error || 'Credenciais inválidas.' });
      }
    } catch (erro) {
      console.error('Erro de conexão:', erro);
      setErrors({ form: 'Servidor indisponível. Verifique se o backend está rodando!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="overlay" onClick={aoFechar}>
        <div className="entrar" onClick={e => e.stopPropagation()}>
          <h2>Bem vindo de volta!</h2>
          
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>
                {errors.form}
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <input 
                type="text" 
                placeholder="username ou e-mail" 
                value={identificador}
                onChange={handleIdentificadorChange}
                required
                style={{ borderColor: errors.identificador ? '#ff6b6b' : 'inherit' }}
              />
              {errors.identificador && (
                <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                  {errors.identificador}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input 
                type="password" 
                placeholder="senha" 
                value={password}
                onChange={handlePasswordChange}
                required
                style={{ borderColor: errors.password ? '#ff6b6b' : 'inherit' }}
              />
              {errors.password && (
                <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                  {errors.password}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'entrar'}
            </button>
          </form>

          <button onClick={aoFechar} className="voltar">voltar</button>
        </div>
      </div>
    </div>
  );
}