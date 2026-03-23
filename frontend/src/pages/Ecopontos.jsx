import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Ecopontos() {
  const [ecopontos, setEcopontos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/ecopontos`)
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
  }, [])

  if (loading) return <div className="page"><p>Carregando...</p></div>
  if (erro) return <div className="page"><p className="status-err">{erro}</p></div>

  return (
    <div className="page">
      <h1>Ecopontos</h1>
      <p className="subtitle">Pontos de coleta seletiva cadastrados</p>

      {ecopontos.length === 0 ? (
        <p>Nenhum ecoponto cadastrado ainda. Use o menu "Novo Ecoponto" para adicionar.</p>
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
                <tr key={ep.id}>
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
