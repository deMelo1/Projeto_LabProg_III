import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function NovoDescarte() {
  const [form, setForm] = useState({
    ecoponto_id: '',
    tipo_residuo: '',
    descricao: '',
  })
  const [ecopontos, setEcopontos] = useState([])
  const [mensagem, setMensagem] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/ecopontos`)
      .then(res => res.json())
      .then(data => setEcopontos(data))
      .catch(() => {})
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMensagem(null)

    const payload = {
      tipo_residuo: form.tipo_residuo,
      ecoponto_id: form.ecoponto_id ? parseInt(form.ecoponto_id) : null,
      descricao: form.descricao || null,
    }

    fetch(`${API_URL}/descartes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao registrar descarte')
        return res.json()
      })
      .then(data => {
        setMensagem(`Descarte registrado com sucesso! (ID: ${data.id})`)
        setForm({ ecoponto_id: '', tipo_residuo: '', descricao: '' })
        setEnviando(false)
      })
      .catch(err => {
        setMensagem(err.message)
        setEnviando(false)
      })
  }

  return (
    <div className="page">
      <h1>Novo Descarte</h1>
      <p className="subtitle">Registrar um descarte realizado</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Tipo de Residuo *
          <select name="tipo_residuo" value={form.tipo_residuo} onChange={handleChange} required>
            <option value="">Selecione o tipo</option>
            <option value="plastico">Plastico</option>
            <option value="vidro">Vidro</option>
            <option value="metal">Metal</option>
            <option value="papel">Papel</option>
            <option value="organico">Organico</option>
            <option value="eletronico">Eletronico</option>
            <option value="outro">Outro</option>
          </select>
        </label>
        <label>
          Ecoponto (opcional)
          <select name="ecoponto_id" value={form.ecoponto_id} onChange={handleChange}>
            <option value="">Nenhum (descarte avulso)</option>
            {ecopontos.map(ep => (
              <option key={ep.id} value={ep.id}>{ep.nome} - {ep.cidade}/{ep.estado}</option>
            ))}
          </select>
        </label>
        <label>
          Descricao (opcional)
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3}
            placeholder="Detalhes sobre o descarte realizado" />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Registrar Descarte'}
        </button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  )
}

export default NovoDescarte
