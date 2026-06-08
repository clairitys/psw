import { useEffect, useState } from 'react';
import { useAlbumStore } from '../store/useAlbumStore';
import { Header } from '../components/Header/Header.jsx';
import { Rodape } from '../components/Rodape/Rodape.jsx';
import { maskAlbumTitle, maskBio } from '../utils/masks';
import { getEntityId } from '../utils/ids';
import { formatCapaUrl } from '../utils/format';
import './style/Listas.css';

export function Listas() {
  const { listas, musicas, fetchDados, adicionarLista } = useAlbumStore();
  const [termo, setTermo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [selectedMusica, setSelectedMusica] = useState('');
  const [capaFile, setCapaFile] = useState(null);
  const [capaPreview, setCapaPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const meuId = getEntityId(authUser);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (!mensagem) return undefined;
    const timer = setTimeout(() => setMensagem(''), 3000);
    return () => clearTimeout(timer);
  }, [mensagem]);

  useEffect(() => {
    if (!capaFile) {
      setCapaPreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(capaFile);
    setCapaPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [capaFile]);

  const minhasListas = meuId
    ? listas.filter((lista) => getEntityId(lista.usuarioId) === meuId)
    : [];

  const resultados = minhasListas.filter((lista) => {
    const texto = termo.toLowerCase().trim();
    return (
      lista.titulo?.toLowerCase().includes(texto) ||
      lista.descricao?.toLowerCase().includes(texto)
    );
  });

  const handleCriarLista = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const itens = selectedMusica ? [selectedMusica] : [];
      let payload;

      if (capaFile) {
        const formData = new FormData();
        formData.append('titulo', titulo.trim());
        formData.append('descricao', descricao.trim());
        formData.append('itens', JSON.stringify(itens));
        formData.append('capa', capaFile);
        payload = formData;
      } else {
        payload = {
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          itens,
        };
      }

      await adicionarLista(payload);
      setTitulo('');
      setDescricao('');
      setSelectedMusica('');
      setCapaFile(null);
      setMensagem('Lista criada com sucesso!');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="listas-page home-container">
      <Header />

      <main className="home-content-wrapper listas-main">
        <section className="listas-hero home-hero">
          <div className="listas-hero-content">
            <span className="listas-badge">Minhas Listas</span>
            <h1>Organize suas músicas favoritas</h1>
            <p>
              Crie listas com capa personalizada e escolha uma música inicial diretamente no
              formulário.
            </p>
          </div>
          <div className="listas-hero-image">
            <img src="/img/default-list.jpg" alt="Listas" />
          </div>
        </section>

        <section className="listas-section">
          <div className="listas-panel">
            <form className="listas-form" onSubmit={handleCriarLista}>
              <h2>Nova lista</h2>
              {mensagem && <p className="listas-msg-sucesso">{mensagem}</p>}
              {errors.form && <p className="listas-msg-erro">{errors.form}</p>}

              <input
                type="text"
                placeholder="Título da nova lista"
                value={titulo}
                onChange={(e) => setTitulo(maskAlbumTitle(e.target.value))}
                maxLength={100}
              />
              {errors.titulo && <span className="listas-field-erro">{errors.titulo}</span>}

              <textarea
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(maskBio(e.target.value))}
                maxLength={500}
                rows={3}
              />

              <label className="listas-label" htmlFor="music-select">
                Selecionar música
              </label>
              <select
                id="music-select"
                value={selectedMusica}
                onChange={(e) => setSelectedMusica(e.target.value)}
                disabled={musicas.length === 0}
              >
                <option value="">
                  {musicas.length === 0 ? 'Carregando músicas...' : 'Selecione uma música'}
                </option>
                {musicas.map((musica) => (
                  <option key={getEntityId(musica)} value={getEntityId(musica)}>
                    {musica.titulo}
                    {musica.artistaId?.nome ? ` — ${musica.artistaId.nome}` : ''}
                  </option>
                ))}
              </select>

              <div className="listas-avatar-field">
                <label htmlFor="capa-upload" className="listas-avatar-field-label">
                  Capa da lista
                </label>
                <input
                  id="capa-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCapaFile(e.target.files[0] || null)}
                />
                {capaFile && <span className="listas-file-name">{capaFile.name}</span>}
                {capaPreview && (
                  <div className="listas-preview-box">
                    <img src={capaPreview} alt="Prévia da capa" className="listas-preview-img" />
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar lista'}
              </button>
            </form>
          </div>

          <div className="listas-grid">
            {resultados.length === 0 ? (
              <div className="listas-empty">Nenhuma lista encontrada.</div>
            ) : (
              resultados.map((lista) => (
                <div key={getEntityId(lista)} className="lista-card">
                  <img
                    src={formatCapaUrl(lista.capa, '/img/default-list.jpg')}
                    alt={lista.titulo}
                  />
                  <div className="lista-card-body">
                    <h2>{lista.titulo}</h2>
                    <p>{lista.descricao || 'Sem descrição'}</p>
                    <span>{Array.isArray(lista.itens) ? `${lista.itens.length} itens` : '0 itens'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Rodape />
    </div>
  );
}
