import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const MESES = [
  '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

function Estatisticas() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/descartes/estatisticas`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar estatisticas')
        return res.json()
      })
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        setErro(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page"><p>Carregando...</p></div>
  if (erro) return <div className="page"><p className="status-err">{erro}</p></div>

  const tiposOrdenados = Object.entries(stats.descartes_por_tipo)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="page">
      <h1>Estatisticas</h1>
      <p className="subtitle">Resumo de atividade de descarte</p>

      <div className="stats-total">
        <span className="stats-numero">{stats.total_descartes}</span>
        <span className="stats-label">descartes registrados</span>
      </div>

      {tiposOrdenados.length > 0 && (
        <div className="stats-secao">
          <h3>Descartes por tipo de residuo</h3>
          <div className="stats-barras">
            {tiposOrdenados.map(([tipo, qtd]) => (
              <div key={tipo} className="stats-barra-item">
                <span className="stats-barra-label">{tipo}</span>
                <div className="stats-barra-container">
                  <div
                    className="stats-barra-fill"
                    style={{ width: `${(qtd / stats.total_descartes) * 100}%` }}
                  />
                </div>
                <span className="stats-barra-valor">{qtd}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.descartes_por_mes.length > 0 && (
        <div className="stats-secao">
          <h3>Descartes por mes</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {stats.descartes_por_mes.map((item, idx) => (
                  <tr key={idx}>
                    <td>{MESES[item.mes]}/{item.ano}</td>
                    <td>{item.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.total_descartes === 0 && (
        <p>Nenhum descarte registrado ainda. Use o menu "Novo Descarte" para comecar.</p>
      )}
    </div>
  )
}

export default Estatisticas
