import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Classificacoes() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtro, setFiltro] = useState('')

  function buscar(tipo) {
    setLoading(true)
    const url = tipo
      ? `${API_URL}/classificacao?tipo_residuo=${encodeURIComponent(tipo)}`
      : `${API_URL}/classificacao`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar classificacoes')
        return res.json()
      })
      .then(data => {
        setItens(data)
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

  function handleRemover(id) {
    if (!confirm('Remover esta classificacao do historico?')) return
    fetch(`${API_URL}/classificacao/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao remover')
        buscar(filtro)
      })
      .catch(err => alert(err.message))
  }

  if (erro) return <div className="page"><p className="status-err">{erro}</p></div>

  return (
    <div className="page">
      <h1>Historico de Classificacoes</h1>
      <p className="subtitle">Imagens classificadas pela F3</p>

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
      ) : itens.length === 0 ? (
        <p>Nenhuma classificacao registrada. {filtro ? 'Tente outro filtro ou ' : ''}Use o menu "Nova Classificacao" para enviar uma imagem.</p>
      ) : (
        <div className="classif-grid">
          {itens.map(c => (
            <div key={c.id} className="classif-card">
              <img
                src={`${API_URL}/classificacao/${c.id}/imagem`}
                alt={c.nome_arquivo}
                className="classif-card-img"
              />
              <div className="classif-card-body">
                <div className="classif-cabecalho">
                  <span className="classif-tipo">{c.tipo_residuo}</span>
                  <span className="classif-confianca">{(c.confianca * 100).toFixed(0)}%</span>
                </div>
                <p className="classif-card-nome">{c.nome_arquivo}</p>
                <p className="classif-card-data">
                  {new Date(c.data_classificacao).toLocaleString('pt-BR')}
                </p>
                <p className="classif-card-orientacao">{c.orientacao}</p>
                <button
                  type="button"
                  onClick={() => handleRemover(c.id)}
                  className="btn btn-excluir"
                  style={{ marginTop: '0.5rem' }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Classificacoes
