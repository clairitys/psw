import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import './style/EditarPerfil.css';

export function EditarPerfil() {
  return (
    <div className="config-page">
      <Header />
      <div className="textos-header">
        <h2>Configurações da Conta</h2>
      </div>

      <nav className="navegaçao-config">
        <ul>
          <li className="active"><Link to="/editar-perfil">PERFIL</Link></li>
          <li><Link to="/alterar-senha">SENHA</Link></li>
          <li><Link to="#">AVATAR</Link></li>
        </ul>
      </nav>

      <main className="grid-config">
        <div className="editar-container">
          <h2>Perfil</h2>
          <form className="form-perfil">
            <input type="text" placeholder="Nome de utilizador" />
            <div className="linha-inputs">
              <input type="email" placeholder="E-mail" />
              <input type="text" placeholder="Localização" />
            </div>
            <textarea placeholder="Bio"></textarea>
            <Link to="/perfil">
              <button type="button" className="submit-button">Salvar Modificações</button>
            </Link>
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
      </main>
      <Rodape />
    </div>
  );
}