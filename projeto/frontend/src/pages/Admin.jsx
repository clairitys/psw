import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header/Header';
import { Rodape } from '../components/Rodape/Rodape';
import {
  maskUsername,
  maskEmail,
  maskArtistName,
  maskBio,
  maskAlbumTitle,
  maskComment,
  maskNumeric,
  maskGenreDescription,
} from '../utils/masks';
import './style/Admin.css';

const API_BASE_URL = '/api';

const getItemId = (item) => item?.id || item?._id;

export function Admin() {
  const [abaAtiva, setAbaAtiva] = useState('artistas');
  const [artistas, setArtistas] = useState([]);
  const [musicas, setMusicas] = useState([]);
  const [albuns, setAlbuns] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [generos, setGeneros] = useState([]);
  
  const [form, setForm] = useState({
    nome: '',
    bio: '',
    titulo: '',
    artistaId: '',
    capa: '',
    data: '',
    generos: [],
    gravadora: '',
    username: '',
    email: '',
    password: '',
    album: '',
    artist: '',
    rating: 5,
    comment: '',
    numero: '',
    tempo: '',
    albumId: '',
    descricao: ''
  });
  const [albumFile, setAlbumFile] = useState(null);
  const [artistFile, setArtistFile] = useState(null);
  
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);

  // Verifica se o usuário é admin ao montar
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser') || localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : {};
    setUsuarioAdmin(user.isAdmin);
    if (!user.isAdmin) {
      exibirMensagem('⚠️ Você não tem permissão de administrador!', 'erro');
    }
  }, []);

  // Carrega todos os dados ao montar o componente
  useEffect(() => { 
    carregarTodosDados(); 
  }, []);

  // Função para limpar mensagem após 3 segundos
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const carregarTodosDados = async () => {
    const token = localStorage.getItem('token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [resArt, resMus, resAlb, resUsr, resAval, resGen] = await Promise.all([
        fetch(`${API_BASE_URL}/artistas`),
        fetch(`${API_BASE_URL}/musicas`),
        fetch(`${API_BASE_URL}/albuns`),
        fetch(`${API_BASE_URL}/users`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/reviews`),
        fetch(`${API_BASE_URL}/generos`),
      ]);

      if (resArt.ok) setArtistas(await resArt.json());
      if (resMus.ok) setMusicas(await resMus.json());
      if (resAlb.ok) setAlbuns(await resAlb.json());
      if (resUsr.ok) setUsuarios(await resUsr.json());
      if (resAval.ok) setAvaliacoes(await resAval.json());
      if (resGen.ok) setGeneros(await resGen.json());
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      exibirMensagem('Erro ao carregar dados: ' + erro.message, 'erro');
    }
  };

  const exibirMensagem = (msg, tipo = 'sucesso') => {
    setMensagem(msg);
    setTipoMensagem(tipo);
  };

  const limparFormulario = () => {
    setForm({
      nome: '',
      bio: '',
      titulo: '',
      artistaId: '',
      capa: '',
      data: '',
      generos: [],
      gravadora: '',
      username: '',
      email: '',
      password: '',
      album: '',
      artist: '',
      rating: 5,
      comment: '',
      numero: '',
      tempo: '',
      albumId: ''
    });
    setAlbumFile(null);
    setArtistFile(null);
    setEditandoId(null);
  };

  const salvarItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      exibirMensagem('Token não encontrado. Faça login novamente.', 'erro');
      return;
    }

    let dados = {};
    let rota = abaAtiva;
    const rotaUrl = rota === 'avaliacoes' ? 'reviews' : rota;
    let url = editandoId 
      ? `${API_BASE_URL}/${rotaUrl}/${editandoId}` 
      : `${API_BASE_URL}/${rotaUrl}`;
    let metodo = editandoId ? 'PUT' : 'POST';

    // Prepara os dados baseado na aba ativa
    try {
      switch (abaAtiva) {
        case 'artistas':
          if (!form.nome.trim()) {
            exibirMensagem('Nome do artista é obrigatório', 'erro');
            return;
          }
          dados = {
            nome: form.nome,
            bio: form.bio,
            foto: form.foto || ''
          };
          break;

        case 'musicas':
          if (!form.titulo.trim() || !form.numero || !form.tempo.trim()) {
            exibirMensagem('Título, Número e Tempo são obrigatórios', 'erro');
            return;
          }
          if (!String(form.albumId).trim()) {
            exibirMensagem('Selecione um álbum', 'erro');
            return;
          }
          dados = {
            titulo: form.titulo,
            numero: parseInt(form.numero),
            tempo: form.tempo,
            albumId: form.albumId
          };
          break;

        case 'albuns':
          if (!form.titulo.trim() || !String(form.artistaId).trim()) {
            exibirMensagem('Título e Artista são obrigatórios', 'erro');
            return;
          }
          const generosList = Array.isArray(form.generos)
            ? form.generos
            : form.generos
              ? String(form.generos)
                  .split(',')
                  .map((g) => g.trim())
                  .filter(Boolean)
              : [];
          dados = {
            titulo: form.titulo,
            artistaId: form.artistaId,
            capa: form.capa || 'img/default-album.jpg',
            data: form.data,
            generos: generosList,
            gravadora: form.gravadora || 'Independente'
          };
          break;

        case 'usuarios':
          if (!form.username.trim() || !form.email.trim()) {
            exibirMensagem('Usuário e email são obrigatórios', 'erro');
            return;
          }
          dados = {
            username: form.username,
            email: form.email,
            name: form.username,
          };
          if (form.password.trim()) {
            dados.password = form.password;
          }
          if (editandoId) {
            url = `${API_BASE_URL}/users/${editandoId}`;
            metodo = 'PUT';
          } else {
            url = `${API_BASE_URL}/auth/signup`;
            metodo = 'POST';
            if (!form.password.trim()) {
              exibirMensagem('Senha é obrigatória para cadastro de usuário', 'erro');
              return;
            }
            dados.password = form.password;
          }
          break;

        case 'avaliacoes':
          if (!form.album.trim() || !form.artist.trim() || !form.rating) {
            exibirMensagem('Álbum, artista e avaliação são obrigatórios', 'erro');
            return;
          }
          dados = {
            album: form.album,
            artist: form.artist,
            rating: parseInt(form.rating),
            comment: form.comment
          };
          if (editandoId) {
            url = `${API_BASE_URL}/reviews/${editandoId}`;
            metodo = 'PUT';
          }
          break;

        case 'generos':
          if (!form.nome.trim()) {
            exibirMensagem('Nome do gênero é obrigatório', 'erro');
            return;
          }
          dados = {
            nome: form.nome,
            descricao: form.descricao || '',
          };
          if (editandoId) {
            url = `${API_BASE_URL}/generos/${editandoId}`;
            metodo = 'PUT';
          } else {
            url = `${API_BASE_URL}/generos`;
            metodo = 'POST';
          }
          break;

        default:
          return;
      }

      const usesFormData = (rotaUrl === 'albuns' && albumFile) || (rotaUrl === 'artistas' && artistFile);
      const headers = {
        Authorization: `Bearer ${token}`
      };
      let bodyData;

      if (usesFormData) {
        bodyData = new FormData();
        if (rotaUrl === 'albuns') {
          bodyData.append('titulo', dados.titulo);
          bodyData.append('artistaId', dados.artistaId);
          bodyData.append('data', dados.data || '');
          bodyData.append('generos', dados.generos.join(','));
          bodyData.append('gravadora', dados.gravadora || 'Independente');
          bodyData.append('capa', albumFile);
        } else {
          bodyData.append('nome', dados.nome);
          bodyData.append('bio', dados.bio || '');
          if (artistFile) bodyData.append('foto', artistFile);
        }
      } else {
        headers['Content-Type'] = 'application/json';
        bodyData = JSON.stringify(dados);
      }

      const response = await fetch(url, {
        method: metodo,
        headers,
        body: bodyData
      });

      if (response.ok) {
        exibirMensagem(`✅ ${abaAtiva} salvo com sucesso!`, 'sucesso');
        limparFormulario();
        await carregarTodosDados();
      } else {
        const errData = await response.json();
        exibirMensagem(`❌ Erro: ${errData.error || 'Erro ao salvar'}`, 'erro');
      }
    } catch (erro) {
      console.error('Erro:', erro);
      exibirMensagem('Erro de conexão', 'erro');
    }
  };

  const deletarItem = async (rota, id) => {
    if (!window.confirm('Tem certeza que deseja excluir? Esta ação é irreversível.')) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      exibirMensagem('Token não encontrado', 'erro');
      return;
    }

    const rotaUrl = rota === 'avaliacoes' ? 'reviews' : rota;

    try {
      const response = await fetch(`${API_BASE_URL}/${rotaUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        exibirMensagem(`✅ Item deletado com sucesso!`, 'sucesso');
        await carregarTodosDados();
      } else {
        exibirMensagem('❌ Erro ao deletar', 'erro');
      }
    } catch (erro) {
      console.error('Erro:', erro);
      exibirMensagem('Erro de conexão', 'erro');
    }
  };

  const editarItem = (item) => {
    const normalizedItem = {
      ...item,
      artistaId: item.artistaId ? getItemId(item.artistaId) : item.artistaId,
      albumId: item.albumId ? getItemId(item.albumId) : item.albumId,
      descricao: item.descricao || '',
      generos: Array.isArray(item.generos)
        ? item.generos
        : item.generos
          ? String(item.generos).split(',').map((g) => g.trim()).filter(Boolean)
          : [],
      capa: item.capa || '',
      foto: item.foto || ''
    };
    setEditandoId(getItemId(item));
    setForm(normalizedItem);
    setAlbumFile(null);
    setArtistFile(null);
    window.scrollTo(0, 0);
  };

  const renderizarFormulario = () => {
    switch (abaAtiva) {
      case 'artistas':
        return (
          <>
            <input 
              required
              placeholder="Nome do artista" 
              value={form.nome} 
              onChange={e => setForm({...form, nome: maskArtistName(e.target.value)})} 
            />
            <textarea 
              placeholder="Biografia" 
              value={form.bio} 
              onChange={e => setForm({...form, bio: maskBio(e.target.value)})}
              rows="3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setArtistFile(e.target.files[0] || null)}
            />
            {artistFile && <span style={{ fontSize: '0.9em', color: '#333' }}>{artistFile.name}</span>}
          </>
        );

      case 'musicas':
        return (
          <>
            <select 
              required
              value={form.albumId} 
              onChange={e => setForm({...form, albumId: e.target.value})}
            >
              <option value="">Selecione um álbum</option>
              {albuns.map(alb => (
                <option key={getItemId(alb)} value={getItemId(alb)}>{alb.titulo}</option>
              ))}
            </select>
            <input 
              required
              type="number"
              placeholder="Número da faixa" 
              value={form.numero} 
              onChange={e => setForm({...form, numero: maskNumeric(e.target.value)})} 
            />
            <input 
              required
              placeholder="Título da música" 
              value={form.titulo} 
              onChange={e => setForm({...form, titulo: maskAlbumTitle(e.target.value)})} 
            />
            <input 
              required
              placeholder="Duração (ex: 3:45)" 
              value={form.tempo} 
              onChange={e => setForm({...form, tempo: e.target.value})} 
            />
          </>
        );

      case 'albuns':
        return (
          <>
            <input 
              required
              placeholder="Título do álbum" 
              value={form.titulo} 
              onChange={e => setForm({...form, titulo: maskAlbumTitle(e.target.value)})} 
            />
            <select 
              required
              value={form.artistaId} 
              onChange={e => setForm({...form, artistaId: e.target.value})}
            >
              <option value="">Selecione um artista</option>
              {artistas.map(a => (
                <option key={getItemId(a)} value={getItemId(a)}>{a.nome}</option>
              ))}
            </select>
            <input 
              placeholder="URL da capa (opcional)" 
              value={form.capa} 
              onChange={e => setForm({...form, capa: e.target.value})} 
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setAlbumFile(e.target.files[0] || null)}
            />
            {albumFile && <span style={{ fontSize: '0.9em', color: '#333' }}>{albumFile.name}</span>}
            <input 
              type="date"
              value={form.data} 
              onChange={e => setForm({...form, data: e.target.value})} 
            />
            <select
              multiple
              value={form.generos || []}
              onChange={(e) => setForm({
                ...form,
                generos: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              {generos.length === 0 ? (
                <option value="">Nenhum gênero disponível</option>
              ) : (
                generos.map((g) => (
                  <option key={g.id || g._id || g.nome} value={g.nome}>{g.nome}</option>
                ))
              )}
            </select>
            <small style={{ color: '#666' }}>Use Ctrl/Cmd para selecionar múltiplos gêneros.</small>
            <input 
              placeholder="Gravadora (opcional)" 
              value={form.gravadora || ''} 
              onChange={e => setForm({...form, gravadora: e.target.value})} 
            />
          </>
        );

      case 'usuarios':
        return (
          <>
            <input 
              required
              placeholder="Nome de usuário" 
              value={form.username} 
              onChange={e => setForm({...form, username: maskUsername(e.target.value)})} 
            />
            <input 
              required
              type="email"
              placeholder="Email" 
              value={form.email} 
              onChange={e => setForm({...form, email: maskEmail(e.target.value)})} 
            />
            <input 
              type="password"
              placeholder={editandoId ? 'Senha (deixe em branco para manter)' : 'Senha'} 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
            {editandoId && <p style={{color: '#999', fontSize: '0.9em'}}>Deixe a senha em branco para manter a senha atual.</p>}
          </>
        );

      case 'generos':
        return (
          <>
            <input
              required
              placeholder="Nome do gênero"
              value={form.nome || ''}
              onChange={e => setForm({...form, nome: maskAlbumTitle(e.target.value)})}
            />
            <textarea
              placeholder="Descrição do gênero (máx 200 caracteres)"
              value={form.descricao || ''}
              onChange={e => setForm({...form, descricao: maskGenreDescription(e.target.value)})}
              rows="3"
            />
            <small style={{color: '#999', fontSize: '0.9em'}}>
              {(form.descricao || '').length}/200 caracteres
            </small>
          </>
        );

      case 'avaliacoes':
        return (
          <>
            <input 
              required
              placeholder="Nome do álbum" 
              value={form.album} 
              onChange={e => setForm({...form, album: maskAlbumTitle(e.target.value)})} 
            />
            <input 
              required
              placeholder="Nome do artista" 
              value={form.artist} 
              onChange={e => setForm({...form, artist: maskArtistName(e.target.value)})} 
            />
            <select 
              required
              value={form.rating} 
              onChange={e => setForm({...form, rating: e.target.value})}
            >
              <option value="">Selecione uma avaliação</option>
              <option value="1">1 - Péssimo</option>
              <option value="2">2 - Ruim</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bom</option>
              <option value="5">5 - Excelente</option>
            </select>
            <textarea 
              placeholder="Comentário (opcional)" 
              value={form.comment} 
              onChange={e => setForm({...form, comment: maskComment(e.target.value)})}
              rows="3"
            />
          </>
        );

      default:
        return null;
    }
  };

  const renderizarTabela = () => {
    switch (abaAtiva) {
      case 'artistas':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Biografia</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {artistas.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign: 'center', color: '#999'}}>Nenhum artista encontrado</td></tr>
              ) : (
                artistas.map(a => (
                  <tr key={getItemId(a)}>
                    <td>{a.nome}</td>
                    <td>{a.bio ? a.bio.substring(0, 50) + '...' : '-'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarItem(a)}>Editar</button>
                      <button className="btn-deletar" onClick={() => deletarItem('artistas', getItemId(a))}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );

      case 'musicas':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Tempo</th>
                <th>Álbum</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {musicas.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', color: '#999'}}>Nenhuma música encontrada</td></tr>
              ) : (
                musicas.map(m => (
                  <tr key={getItemId(m)}>
                    <td>{m.numero}</td>
                    <td>{m.titulo}</td>
                    <td>{m.tempo}</td>
                    <td style={{fontSize: '0.9em'}}>{m.albumId?.titulo || 'N/A'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarItem(m)}>Editar</button>
                      <button className="btn-deletar" onClick={() => deletarItem('musicas', getItemId(m))}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );

      case 'albuns':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Artista</th>
                <th>Data</th>
                <th>Gêneros</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {albuns.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', color: '#999'}}>Nenhum álbum encontrado</td></tr>
              ) : (
                albuns.map(alb => (
                  <tr key={getItemId(alb)}>
                    <td>{alb.titulo}</td>
                    <td>{alb.artistaId?.nome || 'N/A'}</td>
                    <td>{alb.data ? new Date(alb.data).toLocaleDateString() : '-'}</td>
                    <td>{alb.generos?.join(', ') || '-'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarItem(alb)}>Editar</button>
                      <button className="btn-deletar" onClick={() => deletarItem('albuns', getItemId(alb))}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );

      case 'usuarios':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', color: '#999'}}>Nenhum usuário encontrado</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.isAdmin ? '✅ Sim' : '❌ Não'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarItem(u)}>Editar</button>
                      <button className="btn-deletar" onClick={() => deletarItem('users', u._id)}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );

      case 'generos':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {generos.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign: 'center', color: '#999'}}>Nenhum gênero encontrado</td></tr>
              ) : (
                generos.map(g => {
                  const desc = g.descricao || '';
                  return (
                  <tr key={getItemId(g)}>
                    <td>{g.nome}</td>
                    <td>{desc ? desc.substring(0, 80) + (desc.length > 80 ? '...' : '') : '-'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarItem(g)}>Editar</button>
                      <button className="btn-deletar" onClick={() => deletarItem('generos', getItemId(g))}>Deletar</button>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        );

      case 'avaliacoes':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Álbum</th>
                <th>Artista</th>
                <th>Avaliação</th>
                <th>Usuário</th>
                <th>Comentário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', color: '#999'}}>Nenhuma avaliação encontrada</td></tr>
              ) : (
                avaliacoes.map(av => (
                  <tr key={av._id}>
                    <td>{av.album}</td>
                    <td>{av.artist}</td>
                    <td>{'⭐'.repeat(av.rating)}</td>
                    <td>{av.user?.username || 'Anônimo'}</td>
                    <td>{av.comment ? av.comment.substring(0, 30) + '...' : '-'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarItem(av)}>Editar</button>
                      <button className="btn-deletar" onClick={() => deletarItem('reviews', av._id)}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-container container3">
        <h2>🛠️ Painel Administrativo</h2>
        
        {!usuarioAdmin && (
          <div className="admin-msg erro" style={{fontWeight: 'bold', fontSize: '1.1em'}}>
            ⚠️ ATENÇÃO: Você não possui permissões de administrador. Você não conseguirá fazer alterações.
          </div>
        )}
        
        {mensagem && (
          <div className={`admin-msg ${tipoMensagem}`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={salvarItem} className="admin-form">
          <h3>{editandoId ? 'Editar' : 'Novo'} {abaAtiva.slice(0, -1)}</h3>
          {renderizarFormulario()}
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editandoId ? 'Atualizar' : 'Cadastrar'}
            </button>
            {editandoId && (
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={limparFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <nav className="admin-tabs">
          <button 
            className={abaAtiva === 'artistas' ? 'active' : ''} 
            onClick={() => {setAbaAtiva('artistas'); limparFormulario()}}
          >
            👤 Artistas ({artistas.length})
          </button>
          <button 
            className={abaAtiva === 'musicas' ? 'active' : ''} 
            onClick={() => {setAbaAtiva('musicas'); limparFormulario()}}
          >
            🎵 Músicas ({musicas.length})
          </button>
          <button 
            className={abaAtiva === 'albuns' ? 'active' : ''} 
            onClick={() => {setAbaAtiva('albuns'); limparFormulario()}}
          >
            💿 Álbuns ({albuns.length})
          </button>
          <button 
            className={abaAtiva === 'usuarios' ? 'active' : ''} 
            onClick={() => {setAbaAtiva('usuarios'); limparFormulario()}}
          >
            👥 Usuários ({usuarios.length})
          </button>
          <button 
            className={abaAtiva === 'generos' ? 'active' : ''} 
            onClick={() => {setAbaAtiva('generos'); limparFormulario()}}
          >
            🎼 Gêneros ({generos.length})
          </button>
          <button 
            className={abaAtiva === 'avaliacoes' ? 'active' : ''} 
            onClick={() => {setAbaAtiva('avaliacoes'); limparFormulario()}}
          >
            ⭐ Avaliações ({avaliacoes.length})
          </button>
        </nav>

        <div className="admin-lista">
          {renderizarTabela()}
        </div>
      </main>
      <Rodape />
    </div>
  );
}