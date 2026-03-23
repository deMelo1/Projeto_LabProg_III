import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function NovoEcoponto() {
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    tipos_residuo: '',
    descricao: '',
  })
  const [mensagem, setMensagem] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMensagem(null)

    fetch(`${API_URL}/ecopontos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao cadastrar')
        return res.json()
      })
      .then(data => {
        setMensagem(`Ecoponto "${data.nome}" cadastrado com sucesso! (ID: ${data.id})`)
        setForm({ nome: '', endereco: '', cidade: '', estado: '', tipos_residuo: '', descricao: '' })
        setEnviando(false)
      })
      .catch(err => {
        setMensagem(err.message)
        setEnviando(false)
      })
  }

  return (
    <div className="page">
      <h1>Novo Ecoponto</h1>
      <p className="subtitle">Cadastrar um novo ponto de coleta</p>

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
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  )
}

export default NovoEcoponto
