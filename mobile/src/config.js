import Constants from 'expo-constants';

// Porta em que o backend (FastAPI) esta exposto pelo Docker.
const BACKEND_PORT = 8000;

// Caso a deteccao automatica falhe (ex: build de producao), use este valor.
// Em producao, troque por uma URL fixa, ex: 'https://api.seuservidor.com'.
const API_URL_FALLBACK = `http://172.16.7.39:${BACKEND_PORT}`;

// Em desenvolvimento (Expo Go), o app sabe qual IP usou para falar com o
// Metro bundler. Esse IP e o do seu computador na rede local, entao usamos
// ele para montar a URL do backend automaticamente. Assim, ao trocar de
// Wi-Fi, nao e preciso editar este arquivo: o IP se ajusta sozinho.
function detectarApiUrl() {
  // Ex: "172.16.7.39:8081" (host do Metro). Cobre as variacoes de SDK.
  const host =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (host) {
    const ip = host.split(':')[0];
    if (ip) return `http://${ip}:${BACKEND_PORT}`;
  }
  return API_URL_FALLBACK;
}

export const API_URL = detectarApiUrl();
