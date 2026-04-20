import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function EditarEcoponto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/ecopontos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Ecoponto nao encontrado')
        return res.json()
      })
      .then(data => {
        setForm({
          nome: data.nome,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          latitude: data.latitude ?? '',
          longitude: data.longitude ?? '',
          tipos_residuo: data.tipos_residuo,
          descricao: data.descricao ?? '',
        })
        setLoading(false)
      })
      .catch(err => {
        setErro(err.message)
        setLoading(false)
      })
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMensagem(null)

    const payload = {
      ...form,
      latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
      longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
      descricao: form.descricao || null,
    }

    fetch(`${API_URL}/ecopontos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar')
        return res.json()
      })
      .then(() => {
        setMensagem('Ecoponto atualizado com sucesso!')
        setEnviando(false)
        setTimeout(() => navigate(`/ecopontos/${id}`), 1000)
      })
      .catch(err => {
        setMensagem(err.message)
        setEnviando(false)
      })
  }

  if (loading) return <div className="page"><p>Carregando...</p></div>
  if (erro) return <div className="page"><p className="status-err">{erro}</p></div>

  return (
    <div className="page">
      <h1>Editar Ecoponto</h1>
      <p className="subtitle">Alterar dados do ponto de coleta</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Nome *
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </label>
        <label>
          Endereco *
          <input name="endereco" value={form.endereco} onChange={handleChange} required />
        </label>
        <div className="form-row">
          <label>
            Cidade *
            <input name="cidade" value={form.cidade} onChange={handleChange} required />
          </label>
          <label>
            UF *
            <input name="estado" value={form.estado} onChange={handleChange} required maxLength={2}
              placeholder="SP" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Latitude
            <input name="latitude" type="number" step="any" value={form.latitude}
              onChange={handleChange} placeholder="-23.5505" />
          </label>
          <label>
            Longitude
            <input name="longitude" type="number" step="any" value={form.longitude}
              onChange={handleChange} placeholder="-46.6333" />
          </label>
        </div>
        <label>
          Tipos de Residuo * <small>(separados por virgula)</small>
          <input name="tipos_residuo" value={form.tipos_residuo} onChange={handleChange} required
            placeholder="plastico, vidro, metal" />
        </label>
        <label>
          Descricao
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar Alteracoes'}
        </button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  )
}

export default EditarEcoponto
