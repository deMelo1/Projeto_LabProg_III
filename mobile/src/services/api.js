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
