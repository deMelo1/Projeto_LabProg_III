import { API_URL } from '../config';

export async function getEcopontos(tipoResiduo = '') {
  const params = tipoResiduo ? `?tipo_residuo=${encodeURIComponent(tipoResiduo)}` : '';
  const res = await fetch(`${API_URL}/ecopontos${params}`);
  if (!res.ok) throw new Error('Erro ao buscar ecopontos');
  return res.json();
}

export async function getEcoponto(id) {
  const res = await fetch(`${API_URL}/ecopontos/${id}`);
  if (!res.ok) throw new Error('Ecoponto não encontrado');
  return res.json();
}

export async function criarEcoponto(dados) {
  const res = await fetch(`${API_URL}/ecopontos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao criar ecoponto');
  return res.json();
}

export async function atualizarEcoponto(id, dados) {
  const res = await fetch(`${API_URL}/ecopontos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar ecoponto');
  return res.json();
}

export async function deletarEcoponto(id) {
  const res = await fetch(`${API_URL}/ecopontos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar ecoponto');
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error('API indisponível');
  return res.json();
}

export function urlImagemClassificacao(id) {
  return `${API_URL}/classificacao/${id}/imagem`;
}

export async function classificarImagem(uri) {
  const nome = uri.split('/').pop() || 'foto.jpg';
  const ext = (nome.split('.').pop() || 'jpg').toLowerCase();
  const tipoMime = ext === 'png' ? 'image/png' : 'image/jpeg';

  const formData = new FormData();
  formData.append('arquivo', { uri, name: nome, type: tipoMime });

  const res = await fetch(`${API_URL}/classificacao`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    let detalhe = 'Erro ao classificar imagem';
    try {
      const erro = await res.json();
      if (erro?.detail) detalhe = erro.detail;
    } catch {}
    throw new Error(detalhe);
  }
  return res.json();
}

export async function getClassificacoes(tipoResiduo = '') {
  const params = tipoResiduo ? `?tipo_residuo=${encodeURIComponent(tipoResiduo)}` : '';
  const res = await fetch(`${API_URL}/classificacao${params}`);
  if (!res.ok) throw new Error('Erro ao buscar classificacoes');
  return res.json();
}

export async function deletarClassificacao(id) {
  const res = await fetch(`${API_URL}/classificacao/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar classificacao');
  return res.json();
}
