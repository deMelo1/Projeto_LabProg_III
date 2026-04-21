import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Descartes() {
  const [descartes, setDescartes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtro, setFiltro] = useState('')

  function buscar(tipo) {
    setLoading(true)
    const url = tipo
      ? `${API_URL}/descartes?tipo_residuo=${encodeURIComponent(tipo)}`
      : `${API_URL}/descartes`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar descartes')
        return res.json()
      })
      .then(data => {
        setDescartes(data)
        setLoading(false)
      })
      .catch(err => {
        setErro(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { buscar('') }, [])

  function handleFiltrar(e) {
    e.preventDefault()
    buscar(filtro)
  }

  function handleLimpar() {
    setFiltro('')
    buscar('')
  }

  if (erro) return <div className="page"><p className="status-err">{erro}</p></div>

  return (
    <div className="page">
      <h1>Historico de Descartes</h1>
      <p className="subtitle">Registros de descartes realizados</p>

      <form onSubmit={handleFiltrar} className="filtro-bar">
        <input
          type="text"
          placeholder="Filtrar por tipo de residuo (ex: plastico)"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
        <button type="submit">Filtrar</button>
        {filtro && <button type="button" onClick={handleLimpar} className="btn-limpar">Limpar</button>}
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : descartes.length === 0 ? (
        <p>Nenhum descarte registrado. {filtro ? 'Tente outro filtro ou ' : ''}Use o menu "Novo Descarte" para adicionar.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo de Residuo</th>
                <th>Ecoponto</th>
                <th>Descricao</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {descartes.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.tipo_residuo}</td>
                  <td>{d.ecoponto_nome || '—'}</td>
                  <td>{d.descricao || '—'}</td>
                  <td>{new Date(d.data_descarte).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Descartes
