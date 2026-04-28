import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avaliacao } from '../Avaliacao/Avaliacao.jsx';
import { Entre } from '../../pages/Entre.jsx'; 
import { Cadastro } from '../../pages/Cadastro.jsx';
import './Header.css';

export function Header() {
  const navigate = useNavigate();
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [modalEntre, setModalEntre] = useState(false);
  const [modalCadastro, setModalCadastro] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setUser(JSON.parse(authUser));
    }
  }, []);

  const lidarComLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    setDropdownAberto(false);
    navigate('/');
  };

  return (
    <>
      <header className="container">
        <h1>
          <Link to={user ? "/home" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>
            JukeBoxd
          </Link>
        </h1>

        <nav className="direita">
          {user ? (
            /* LAYOUT QUANDO LOGADO (HOME / ALBUM) */
            <>
              <Link to="/artistas">artistas</Link>
              <a href="#">álbuns</a>
              <a href="#">listas</a>

              {/* Usuário primeiro com design original e fonte corrigida */}
              <div className="dropdown">
                <div className="userTrigger" onClick={() => setDropdownAberto(!dropdownAberto)}>
                  <img src="/img/icon.jpg" className="pfp" alt="pfp" />
                  <span style={{ 
                    fontFamily: "'Outfit', sans-serif", 
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: '400' 
                  }}>
                    {user.username}
                  </span>
                  <span className="seta"></span>
                </div>

                {dropdownAberto && (
                  <div className="dropdownCT">
                    <Link to="/perfil">meu perfil</Link>
                    <a href="#">configurações</a>
                    <hr />
                    <a href="#" onClick={lidarComLogout}>sair</a>
                  </div>
                )}
              </div>

              {/* Botão Avaliar DEPOIS do usuário */}
              <button className="botao-log" onClick={() => setModalAvaliacao(true)}>
                + Avaliar
              </button>
            </>
          ) : (
            /* LAYOUT QUANDO DESLOGADO (INÍCIO) */
            <>
              {/* Entrar e Criar conta como PRIMEIROS itens */}
              <button className="link-style-btn" onClick={() => setModalEntre(true)}>entre</button>
              <button className="link-style-btn" onClick={() => setModalCadastro(true)}>criar conta</button>
              
              <Link to="/artistas">artistas</Link>
              <a href="#">álbuns</a>
            </>
          )}
        </nav>
      </header>

      {/* Modais */}
      {modalAvaliacao && <Avaliacao aoFechar={() => setModalAvaliacao(false)} />}
      {modalEntre && <Entre aoFechar={() => setModalEntre(false)} />}
      {modalCadastro && <Cadastro aoFechar={() => setModalCadastro(false)} />}
    </>
  );
}