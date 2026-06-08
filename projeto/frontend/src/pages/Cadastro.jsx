import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maskUsername, maskEmail, maskPassword } from '../utils/masks';
import { isValidUsername, isValidEmail, isValidPassword, validateField } from '../utils/validators';
import './style/Cadastro.css';

export function Cadastro({ aoFechar }) {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    const value = maskUsername(e.target.value);
    setUsername(value);
    // Limpar erro ao usuário começar a digitar
    if (errors.username) {
      const validation = validateField('username', value);
      setErrors(prev => ({
        ...prev,
        username: !validation.valid ? validation.message : ''
      }));
    }
  };

  const handleEmailChange = (e) => {
    const value = maskEmail(e.target.value);
    setEmail(value);
    if (errors.email) {
      const validation = validateField('email', value);
      setErrors(prev => ({
        ...prev,
        email: !validation.valid ? validation.message : ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      const validation = validateField('password', value);
      setErrors(prev => ({
        ...prev,
        password: !validation.valid ? validation.message : ''
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      const newError = password !== e.target.value ? 'As senhas não coincidem' : '';
      setErrors(prev => ({
        ...prev,
        confirmPassword: newError
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar username
    if (!isValidUsername(username)) {
      newErrors.username = 'Username deve ter no mínimo 3 caracteres e conter apenas letras, números e underscore';
    }

    // Validar email
    if (!isValidEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!isValidPassword(password)) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    // Validar confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
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
      const resposta = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        aoFechar?.();
        navigate('/entre');
      } else {
        const mensagemErro = dados.error || (dados.errors && dados.errors[0]?.msg) || 'Não foi possível cadastrar.';
        setErrors({ form: mensagemErro });
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
          <h2>Criar Conta</h2>
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>
                {errors.form}
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <input 
                type="text" 
                placeholder="username" 
                value={username}
                onChange={handleUsernameChange}
                maxLength="20"
                required
                style={{ borderColor: errors.username ? '#ff6b6b' : 'inherit' }}
              />
              {errors.username && (
                <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                  {errors.username}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input 
                type="email" 
                placeholder="e-mail" 
                value={email}
                onChange={handleEmailChange}
                required
                style={{ borderColor: errors.email ? '#ff6b6b' : 'inherit' }}
              />
              {errors.email && (
                <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                  {errors.email}
                </span>
              )}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input 
                type="password" 
                placeholder="senha" 
                value={password}
                onChange={handlePasswordChange}
                minLength="6"
                required
                style={{ borderColor: errors.password ? '#ff6b6b' : 'inherit' }}
              />
              {errors.password && (
                <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                  {errors.password}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input 
                type="password" 
                placeholder="confirmar senha" 
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                minLength="6"
                required
                style={{ borderColor: errors.confirmPassword ? '#ff6b6b' : 'inherit' }}
              />
              {errors.confirmPassword && (
                <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '15px', textAlign: 'left', marginLeft: '5px' }}>
              * Username: min 3 caracteres (letras, números, underscore)
              <br/>
              * Senha: min 6 caracteres
            </span>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'cadastrar'}
            </button>
          </form>
          <button onClick={aoFechar} className="voltar">voltar</button>
        </div>
      </div>
    </div>
  );
}