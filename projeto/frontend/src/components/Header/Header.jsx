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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
              {/* CORREÇÃO: Trocamos o <a> pelo <Link> */}
              <Link to="/albuns">álbuns</Link>
              <Link to="/generos">gêneros</Link>
              <Link to="/listas">listas</Link>

              <div className="dropdown">
                <div className="userTrigger" onClick={() => setDropdownAberto(!dropdownAberto)}>
                  <img src="/img/icon.jpg" className="pfp" alt="pfp" />
                  <span style={{ 
                    fontFamily: "'Outfit', sans-serif", 
                    color: '#FFFFFF',
                    fontWeight: '400' 
                  }}>
                    {user.username}
                  </span>
                  <span className="seta"></span>
                </div>

                {dropdownAberto && (
                  <div className="dropdownCT">
                    <Link to="/perfil">meu perfil</Link>
                    {/* CORREÇÃO AQUI TAMBÉM */}
                      <Link to="/editar-perfil">configurações</Link>
                    <hr />
                    {/* O botão de sair continua sendo <a> porque ele executa uma função em vez de navegar para uma tela */}
                    <a href="#" onClick={lidarComLogout}>sair</a>
                  </div>
                )}
              </div>

              <button className="botao-log" onClick={() => setModalAvaliacao(true)}>
                + Avaliar
              </button>
            </>
          ) : (
            /* LAYOUT QUANDO DESLOGADO (INÍCIO) */
            <>
              <button className="link-style-btn" onClick={() => setModalEntre(true)}>entre</button>
              <button className="link-style-btn" onClick={() => setModalCadastro(true)}>criar conta</button>
              
              <Link to="/artistas">artistas</Link>
              {/* CORREÇÃO: Trocamos o <a> pelo <Link> */}
              <Link to="/albuns">álbuns</Link>
               <Link to="/generos">gêneros</Link>
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