import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio.jsx'; 
import { Entre } from './pages/Entre.jsx';
import { Cadastro } from './pages/Cadastro.jsx';
import { Admin } from './pages/Admin.jsx';
import { Album } from './pages/Album.jsx';
import { Artista } from './pages/Artista.jsx';
import { Home } from './pages/Home.jsx'; // Importação da Home
import { PrivateRoute } from './pages/PrivateRoute.jsx'; // A IMPORTAÇÃO QUE ESTAVA FALTANDO
import { Usuario } from './pages/Usuario';
import { EditarPerfil } from './pages/EditarPerfil';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Rota pública inicial */}
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil" element={<Usuario />} />
        {/* Rotas de autenticação */}
        <Route path="/entre" element={<Entre />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        {/* Rota protegida: só acessa se estiver logado */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        {/* Outras rotas */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/artista/:id" element={<Artista />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;