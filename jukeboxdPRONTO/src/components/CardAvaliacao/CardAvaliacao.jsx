import './CardAvaliacao.css';

export function CardAvaliacao({ capa, titulo, artista, userImg, username, estrelas, comentario, data }) {
  return (
    <div className="avCT">
      <img src={capa} className="img1" alt="Capa" />
      <div className="info">
        <h1>{titulo}</h1>
        <span className="subtitulo">{artista}</span>
        <div className="user">
          <img src={userImg} className="img2" alt="User" />
          <span className="usuario">{username}</span>
          <div className="stars">{estrelas}</div>
        </div>
        <p className="comentario">{comentario}</p>
        <span className="data">Avaliado em: {data}</span>
      </div>
    </div>
  );
}