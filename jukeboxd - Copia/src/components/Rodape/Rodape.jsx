import { Link } from 'react-router-dom';
import './Rodape.css';

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="esquerdo">
        <div className="links">
          <a href="#">sobre</a>
          <a href="#">contato</a>
          <a href="#">acervo</a>
          <a href="#">termos</a>
        </div>
        <div className="conteúdo">
          <p>&copy; 2026 JukeBoxd. Todos os direitos reservados.</p>
        </div>        
      </div>
      <div className="redes">
        <div className="item"><img src="img/instagram.png" alt="Insta" /> @jukeboxd</div>
        <div className="item"><img src="img/facebook.png" alt="FB" /> jukeboxd</div>
        <div className="item"><img src="img/email.png" alt="Email" /> contato@jukeboxd.com</div>
      </div>
    </footer>
  );
}