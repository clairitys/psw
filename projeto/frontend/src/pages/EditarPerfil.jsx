import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { maskName, maskBio, maskEmail } from '../utils/masks';
import { isValidEmail, isValidName } from '../utils/validators';
import { formatAvatarUrl } from '../utils/format';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import './style/EditarPerfil.css';

export function EditarPerfil() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  
  // Estado do formulário de perfil
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  
  // Estado do formulário de avatar
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // Estado do formulário de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'senha') setActiveTab('senha');
    else if (hash === 'avatar') setActiveTab('avatar');
    else if (hash === 'perfil') setActiveTab('perfil');
  }, []);

  useEffect(() => {
    if (!avatarFile) return undefined;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.user || {};
          setUsername(user.username || '');
          setEmail(user.email || '');
          setName(user.name || '');
          setBio(user.bio || '');
          setAvatar(user.avatar || '');
          localStorage.setItem('authUser', JSON.stringify(user));
          return;
        }

        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        setUsername(authUser.username || '');
        setEmail(authUser.email || '');
        setName(authUser.name || '');
        setBio(authUser.bio || '');
        setAvatar(authUser.avatar || '');
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
  }, []);

  // Validação do formulário de perfil
  const validateProfileForm = () => {
    const newErrors = {};

    if (email && !isValidEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (name && !isValidName(name)) {
      newErrors.name = 'Nome deve conter apenas letras e espaços';
    }

    if (bio.length > 500) {
      newErrors.bio = 'Bio deve ter no máximo 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validação do formulário de senha
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!senhaAtual) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    }

    if (!senhaNova) {
      newErrors.senhaNova = 'Nova senha é obrigatória';
    } else if (senhaNova.length < 6) {
      newErrors.senhaNova = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (senhaNova !== senhaConfirm) {
      newErrors.senhaConfirm = 'As senhas não coincidem';
    }

    if (senhaNova === senhaAtual) {
      newErrors.senhaNova = 'A nova senha deve ser diferente da senha atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário de perfil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const authHeaders = { Authorization: `Bearer ${token}` };

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (bio !== undefined) updateData.bio = bio;

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...JSON.parse(localStorage.getItem('authUser')), ...data.user };
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSuccess('Perfil atualizado com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ form: data.error || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ form: 'Erro ao atualizar perfil. Verifique a conexão.' });
    } finally {
      setLoading(false);
    }
  };

  //Submeter formulário de avatar
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      setErrors({ form: 'Selecione uma imagem antes de enviar.' });
      return;
    }

    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...JSON.parse(localStorage.getItem('authUser')), ...data.user };
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAvatar(updatedUser.avatar || '');
        setAvatarFile(null);
        setAvatarPreview('');

        setSuccess('Avatar atualizado com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ form: data.error || 'Erro ao atualizar avatar' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ form: 'Erro ao atualizar avatar. Verifique a conexão.' });
    } finally {
      setLoading(false);
    }
  };

  // Submeter formulário de senha
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: senhaNova,
          currentPassword: senhaAtual
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Senha alterada com sucesso!');
        setSenhaAtual('');
        setSenhaNova('');
        setSenhaConfirm('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ form: data.error || 'Erro ao alterar senha. Verifique sua senha atual.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ form: 'Erro ao alterar senha. Verifique a conexão.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-page">
      <Header />
      <div className="textos-header">
        <h2>Configurações da Conta</h2>
      </div>

      <nav className="navegaçao-config">
        <ul>
          <li 
            className={activeTab === 'perfil' ? 'active' : ''}
            onClick={() => setActiveTab('perfil')}
          >
            <a href="#perfil">PERFIL</a>
          </li>
          <li 
            className={activeTab === 'senha' ? 'active' : ''}
            onClick={() => setActiveTab('senha')}
          >
            <a href="#senha">SENHA</a>
          </li>
          <li 
            className={activeTab === 'avatar' ? 'active' : ''}
            onClick={() => setActiveTab('avatar')}
          >
            <a href="#avatar">AVATAR</a>
          </li>
        </ul>
      </nav>


      <main className={activeTab === 'perfil' ? "grid-config" : "full-width-config"}>
        {/* Aba Perfil */}
        {activeTab === 'perfil' && (
          <>
          <div className="editar-container">
            <h2>Editar Perfil</h2>
            <form className="form-perfil" onSubmit={handleProfileSubmit}>
              {success && (
                <div style={{ color: '#4CAF50', marginBottom: '15px', fontSize: '0.9rem' }}>
                  ✓ {success}
                </div>
              )}
              {errors.form && (
                <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>
                  {errors.form}
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Username (não editável)</label>
                <input 
                  type="text" 
                  value={username}
                  disabled
                  style={{ backgroundColor: '#d6d6d6', cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Nome</label>
                <input 
                  type="text" 
                  placeholder="Nome" 
                  value={name}
                  onChange={(e) => setName(maskName(e.target.value))}
                  maxLength="100"
                />
                {errors.name && (
                  <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="linha-inputs">
                <div style={{ marginBottom: '15px', flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', color: '#ccc' }}>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(maskEmail(e.target.value))}

                  />
                  {errors.email && (
                    <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Bio ({bio.length}/500)</label>
                <textarea 
                  placeholder="Conte-nos sobre você..."
                  value={bio}
                  onChange={(e) => setBio(maskBio(e.target.value))}
                  maxLength="500"
                  rows="4"
                  style={{ backgroundColor: '#ffffff'}}
                />
                {errors.bio && (
                  <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                    {errors.bio}
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Modificações'}
              </button>
            </form>
          </div>

          <section className="favoritos-edit">
              <h3>ÁLBUNS FAVORITOS</h3>
              <div className="posters-container">
                <img src="img/ateez.jpg" alt="Fav 1" className="poster" />
                <img src="img/hs2.png" alt="Fav 2" className="poster" />
                <img src="img/gaga.jpg" alt="Fav 3" className="poster" />
                <img src="img/lana.jpg" alt="Fav 4" className="poster" />
              </div>
              <p className="drag-hint">Arraste para reordenar.</p>
            </section>
          </>
        )}

        {/* Aba Avatar */}
        {activeTab === 'avatar' && (
          <div className="editar-container">
            <h2>Alterar Avatar</h2>
            <form className="form-perfil" onSubmit={handleAvatarSubmit}>
              {success && (
                <div style={{ color: '#4CAF50', marginBottom: '15px', fontSize: '0.9rem' }}>
                  ✓ {success}
                </div>
              )}
              {errors.form && (
                <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>
                  {errors.form}
                </div>
              )}

              <div className="avatar-field" style={{ marginBottom: '20px' }}>
                <label htmlFor="avatar-upload" className="avatar-field-label">
                  
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="avatar-file-input"
                  onChange={(e) => setAvatarFile(e.target.files[0] || null)}
                />
                {avatarFile && (
                  <span className="avatar-file-name" style={{ display: 'block', marginTop: '8px' }}>
                    {avatarFile.name}
                  </span>
                )}
                <div className="avatar-preview-box" style={{ marginTop: '15px' }}>
                  <img
                    src={
                      avatarPreview ||
                      formatAvatarUrl(avatar)
                    }
                    alt="Pré-visualização do avatar"
                    className="avatar-preview-img"
                    onError={(e) => {
                      e.target.src = '/img/user.jpg';
                    }}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Atualizar Avatar'}
              </button>
            </form>
          </div>
        )}

        {/* Aba Senha */}
        {activeTab === 'senha' && (
          <div className="editar-container">
            <h2>Alterar Senha</h2>
            <form className="form-perfil" onSubmit={handlePasswordSubmit}>
              {success && (
                <div style={{ color: '#4CAF50', marginBottom: '15px', fontSize: '0.9rem' }}>
                  ✓ {success}
                </div>
              )}
              {errors.form && (
                <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>
                  {errors.form}
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Senha Atual</label>
                <input 
                  type="password" 
                  placeholder="Digite sua senha atual" 
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                />
                {errors.senhaAtual && (
                  <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                    {errors.senhaAtual}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Nova Senha</label>
                <input 
                  type="password" 
                  placeholder="Digite a nova senha" 
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  minLength="6"
                  requiredgit 
                />
                {errors.senhaNova && (
                  <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                    {errors.senhaNova}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  placeholder="Confirme a nova senha" 
                  value={senhaConfirm}
                  onChange={(e) => setSenhaConfirm(e.target.value)}
                  minLength="6"
                  required
                />
                {errors.senhaConfirm && (
                  <span style={{ fontSize: '0.75rem', color: '#ff6b6b', display: 'block', marginTop: '3px' }}>
                    {errors.senhaConfirm}
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Atualizar Senha'}
              </button>
            </form>
          </div>
        )}

        
      </main>
      <Rodape />
    </div>
  );
}