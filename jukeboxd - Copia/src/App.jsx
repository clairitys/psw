import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio.jsx'; 
import { Entre } from './pages/Entre.jsx';
import { Cadastro } from './pages/Cadastro.jsx';
import { Admin } from './pages/Admin.jsx';
import { Album } from './pages/Album.jsx';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/entre" element={<Entre />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/album/:id" element={<Album />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
