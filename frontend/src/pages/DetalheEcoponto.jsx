import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function DetalheEcoponto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ecoponto, setEcoponto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/ecopontos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Ecoponto nao encontrado')
        return res.json()
      })
      .then(data => {
        setEcoponto(data)
        setLoading(false)
      })
      .catch(err => {
        setErro(err.message)
        setLoading(false)
      })
  }, [id])

  function handleExcluir() {
    if (!window.confirm(`Deseja realmente excluir o ecoponto "${ecoponto.nome}"?`)) return

    fetch(`${API_URL}/ecopontos/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao excluir')
        navigate('/ecopontos')
      })
      .catch(err => setErro(err.message))
  }

  if (loading) return <div className="page"><p>Carregando...</p></div>
  if (erro) return <div className="page"><p className="status-err">{erro}</p></div>

  return (
    <div className="page">
      <h1>{ecoponto.nome}</h1>
      <p className="subtitle">Detalhes do ponto de coleta</p>

      <div className="detalhe-grid">
        <div className="detalhe-campo">
          <span className="detalhe-label">Endereco</span>
          <span>{ecoponto.endereco}</span>
        </div>
        <div className="detalhe-campo">
          <span className="detalhe-label">Cidade</span>
          <span>{ecoponto.cidade}</span>
        </div>
        <div className="detalhe-campo">
          <span className="detalhe-label">UF</span>
          <span>{ecoponto.estado}</span>
        </div>
        <div className="detalhe-campo">
          <span className="detalhe-label">Tipos de Residuo</span>
          <span>{ecoponto.tipos_residuo}</span>
        </div>
        {ecoponto.latitude && ecoponto.longitude && (
          <div className="detalhe-campo">
            <span className="detalhe-label">Coordenadas</span>
            <span>{ecoponto.latitude}, {ecoponto.longitude}</span>
          </div>
        )}
        {ecoponto.descricao && (
          <div className="detalhe-campo">
            <span className="detalhe-label">Descricao</span>
            <span>{ecoponto.descricao}</span>
          </div>
        )}
        <div className="detalhe-campo">
          <span className="detalhe-label">Cadastrado em</span>
          <span>{new Date(ecoponto.criado_em).toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className="acoes">
        <Link to={`/editar-ecoponto/${ecoponto.id}`} className="btn btn-editar">Editar</Link>
        <button onClick={handleExcluir} className="btn btn-excluir">Excluir</button>
      </div>
    </div>
  )
}

export default DetalheEcoponto
