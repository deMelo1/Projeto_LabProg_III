import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Ecopontos from './pages/Ecopontos'
import NovoEcoponto from './pages/NovoEcoponto'
import DetalheEcoponto from './pages/DetalheEcoponto'
import EditarEcoponto from './pages/EditarEcoponto'
import Descartes from './pages/Descartes'
import NovoDescarte from './pages/NovoDescarte'
import Estatisticas from './pages/Estatisticas'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <span className="navbar-brand">EcoFilter</span>
        <div className="navbar-links">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/ecopontos">Ecopontos</NavLink>
          <NavLink to="/novo-ecoponto">Novo Ecoponto</NavLink>
          <NavLink to="/descartes">Descartes</NavLink>
          <NavLink to="/novo-descarte">Novo Descarte</NavLink>
          <NavLink to="/estatisticas">Estatisticas</NavLink>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ecopontos" element={<Ecopontos />} />
          <Route path="/ecopontos/:id" element={<DetalheEcoponto />} />
          <Route path="/novo-ecoponto" element={<NovoEcoponto />} />
          <Route path="/editar-ecoponto/:id" element={<EditarEcoponto />} />
          <Route path="/descartes" element={<Descartes />} />
          <Route path="/novo-descarte" element={<NovoDescarte />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
