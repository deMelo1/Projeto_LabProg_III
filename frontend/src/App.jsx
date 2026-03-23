import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Ecopontos from './pages/Ecopontos'
import NovoEcoponto from './pages/NovoEcoponto'
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
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ecopontos" element={<Ecopontos />} />
          <Route path="/novo-ecoponto" element={<NovoEcoponto />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
