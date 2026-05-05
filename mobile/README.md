# EcoFilter Mobile

App mobile do EcoFilter desenvolvido com React Native (Expo), implementando a funcionalidade F1 - Mapeamento e Gestao de Ecopontos.

## Funcionalidades

- **Tela Home**: Status de conexao com a API e navegacao principal
- **Listar Ecopontos**: Lista todos os pontos de coleta com filtro por tipo de residuo
- **Detalhes do Ecoponto**: Visualizacao completa com opcoes de editar e excluir
- **Novo Ecoponto**: Formulario para cadastrar novo ponto de coleta
- **Editar Ecoponto**: Formulario para atualizar dados do ponto de coleta
- **Excluir Ecoponto**: Exclusao com confirmacao via Alert

## Estrutura de Navegacao

```
Home
  └── Ecopontos (lista)
        ├── DetalheEcoponto (detalhes + editar/excluir)
        │     └── EditarEcoponto (formulario de edicao)
        └── NovoEcoponto (formulario de criacao)
```

## Pre-requisitos

- Node.js 18+
- Expo CLI (`npx expo`)
- Backend do EcoFilter rodando (porta 8000)
- Expo Go no celular (para testar no dispositivo fisico)

## Configuracao da API

Edite o arquivo `src/config.js` com o IP do seu computador na rede local:

```javascript
// Para dispositivo fisico na mesma rede Wi-Fi:
export const API_URL = 'http://192.168.x.x:8000';

// Para emulador Android:
export const API_URL = 'http://10.0.2.2:8000';

// Para iOS Simulator:
export const API_URL = 'http://localhost:8000';
```

## Como executar

```bash
# Instalar dependencias
npm install

# Iniciar o Expo
npx expo start
```

Depois, escaneie o QR Code com o app Expo Go (Android) ou Camera (iOS).

## Tecnologias

- React Native (Expo SDK)
- React Navigation (Native Stack)
- Fetch API para consumo da API REST
