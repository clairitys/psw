import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio.jsx'; 
import { Entre } from './pages/Entre.jsx';
import { Cadastro } from './pages/Cadastro.jsx';
import { Admin } from './pages/Admin.jsx';
import { Album } from './pages/Album.jsx';
import { Artista } from './pages/Artista.jsx';
import { Home } from './pages/Home.jsx'; 
import { PrivateRoute } from './pages/PrivateRoute.jsx';
import { AdminRoute } from './pages/AdminRoute.jsx';
import { Usuario } from './pages/Usuario';
import { EditarPerfil } from './pages/EditarPerfil';

// CORREÇÃO 1: Ajustado de ReviewDetalhe para ReviewDetalhe (conforme o seu import original)
import { ReviewDetalhe } from './pages/ReviewDetalhe';

// --- AS IMPORTAÇÕES NOVAS DO MENU ---
import { PagArtistas } from './pages/PagArtistas.jsx';
import { Albuns } from './pages/Albuns.jsx';
import { Listas } from './pages/Listas.jsx';
import { Generos } from './pages/Generos.jsx';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Rota pública inicial */}
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil" element={<PrivateRoute><Usuario /></PrivateRoute>} />
        
        {/* Rotas de autenticação */}
        <Route path="/entre" element={<Entre />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/editar-perfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
        
        {/* Rota protegida: só acessa se estiver logado */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        {/* --- AS TRÊS ROTAS NOVAS DO MENU --- */}
        <Route path="/artistas" element={<PagArtistas />} />
        <Route path="/albuns" element={<Albuns />} />
        <Route path="/listas" element={<PrivateRoute><Listas /></PrivateRoute>} />
        <Route path="/generos" element={<Generos />} />

        {/* Outras rotas */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/artista/:id" element={<Artista />} />
        
        {/* CORREÇÃO 2: Alterado o element de ReviewDetalhes para ReviewDetalhe para corresponder ao import */}
        <Route path="/review/:id" element={<ReviewDetalhe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;