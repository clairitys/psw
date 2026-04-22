import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio.jsx'; // Adicione .jsx se necessário
import { Entre } from './pages/Entre.jsx';
import { Cadastro } from './pages/Cadastro.jsx';
import { Admin } from './pages/Admin';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/entre" element={<Entre />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
