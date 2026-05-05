import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function NovaClassificacao() {
  const [arquivo, setArquivo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null
    setArquivo(f)
    setResultado(null)
    setErro(null)
    if (f) {
      const reader = new FileReader()
      reader.onload = ev => setPreview(ev.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!arquivo) {
      setErro('Selecione uma imagem antes de enviar.')
      return
    }
    setEnviando(true)
    setErro(null)
    setResultado(null)

    const formData = new FormData()
    formData.append('arquivo', arquivo)

    fetch(`${API_URL}/classificacao`, {
      method: 'POST',
      body: formData,
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Erro ao classificar imagem')
        return data
      })
      .then(data => {
        setResultado(data)
        setEnviando(false)
      })
      .catch(err => {
        setErro(err.message)
        setEnviando(false)
      })
  }

  function handleLimpar() {
    setArquivo(null)
    setPreview(null)
    setResultado(null)
    setErro(null)
    const input = document.getElementById('input-arquivo')
    if (input) input.value = ''
  }

  return (
    <div className="page">
      <h1>Nova Classificacao</h1>
      <p className="subtitle">Envie uma imagem do residuo para identificar a categoria e a orientacao de descarte</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Imagem do residuo *
          <input
            id="input-arquivo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        {preview && (
          <div className="classif-preview">
            <img src={preview} alt="preview" />
          </div>
        )}

        <div className="form-row" style={{ alignItems: 'center' }}>
          <button type="submit" disabled={enviando || !arquivo}>
            {enviando ? 'Classificando...' : 'Classificar'}
          </button>
          {(arquivo || resultado) && (
            <button type="button" onClick={handleLimpar} className="btn-limpar"
              style={{ background: '#888', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 6, cursor: 'pointer' }}>
              Limpar
            </button>
          )}
        </div>
      </form>

      {erro && <p className="mensagem" style={{ background: '#fde8e6', borderColor: '#f5b1aa', color: '#c0392b' }}>{erro}</p>}

      {resultado && (
        <div className="classif-resultado">
          <h3>Resultado</h3>
          <div className="classif-cabecalho">
            <span className="classif-tipo">{resultado.tipo_residuo}</span>
            <span className="classif-confianca">
              Confianca: {(resultado.confianca * 100).toFixed(0)}%
            </span>
          </div>
          <div className="classif-orientacao">
            <strong>Orientacao de descarte:</strong>
            <p>{resultado.orientacao}</p>
          </div>
          <p className="classif-meta">
            Salvo no historico (ID: {resultado.id}) — arquivo: {resultado.nome_arquivo}
          </p>
        </div>
      )}
    </div>
  )
}

export default NovaClassificacao
