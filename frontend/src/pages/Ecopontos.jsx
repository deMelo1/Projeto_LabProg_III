import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Ecopontos() {
  const [ecopontos, setEcopontos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtro, setFiltro] = useState('')
  const navigate = useNavigate()

  function buscar(tipo) {
    setLoading(true)
    const url = tipo
      ? `${API_URL}/ecopontos?tipo_residuo=${encodeURIComponent(tipo)}`
      : `${API_URL}/ecopontos`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar ecopontos')
        return res.json()
      })
      .then(data => {
        setEcopontos(data)
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
      <h1>Ecopontos</h1>
      <p className="subtitle">Pontos de coleta seletiva cadastrados</p>

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
      ) : ecopontos.length === 0 ? (
        <p>Nenhum ecoponto encontrado. {filtro ? 'Tente outro filtro ou ' : ''}Use o menu "Novo Ecoponto" para adicionar.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Endereco</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>Tipos de Residuo</th>
              </tr>
            </thead>
            <tbody>
              {ecopontos.map(ep => (
                <tr key={ep.id} onClick={() => navigate(`/ecopontos/${ep.id}`)} className="tr-link">
                  <td>{ep.id}</td>
                  <td>{ep.nome}</td>
                  <td>{ep.endereco}</td>
                  <td>{ep.cidade}</td>
                  <td>{ep.estado}</td>
                  <td>{ep.tipos_residuo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Ecopontos
