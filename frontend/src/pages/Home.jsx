import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Home() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('offline'))
  }, [])

  return (
    <div className="page">
      <h1>EcoFilter</h1>
      <p className="subtitle">Sistema de descarte correto de residuos</p>

      <div className="cards">
        <div className="card-info">
          <h3>F1 - Ecopontos</h3>
          <p>Cadastro e consulta de pontos de coleta seletiva com filtro por tipo de residuo.</p>
        </div>
        <div className="card-info">
          <h3>F2 - Historico</h3>
          <p>Registro de descartes realizados e estatisticas simples de uso.</p>
        </div>
        <div className="card-info">
          <h3>F3 - Classificacao</h3>
          <p>Envio de imagem do residuo com classificacao automatica e orientacao de descarte.</p>
        </div>
      </div>

      <div className="status-box">
        API Status: <span className={status === 'ok' ? 'status-ok' : 'status-err'}>
          {status || 'verificando...'}
        </span>
      </div>
    </div>
  )
}

export default Home
