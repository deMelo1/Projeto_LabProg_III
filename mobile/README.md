# EcoFilter Mobile

App mobile do EcoFilter desenvolvido com React Native (Expo), implementando F1 - Mapeamento e Gestao de Ecopontos e F3 - Classificacao de residuos por imagem (usando a camera do celular).

## Funcionalidades

### F1 - Ecopontos
- **Tela Home**: Status de conexao com a API e navegacao principal
- **Listar Ecopontos**: Lista todos os pontos de coleta com filtro por tipo de residuo
- **Detalhes do Ecoponto**: Visualizacao completa com opcoes de editar e excluir
- **Novo Ecoponto**: Formulario para cadastrar novo ponto de coleta
- **Editar Ecoponto**: Formulario para atualizar dados do ponto de coleta
- **Excluir Ecoponto**: Exclusao com confirmacao via Alert

### F3 - Classificacao por imagem
- **Nova Classificacao**: Tira foto (ou escolhe da galeria) e envia o residuo para classificacao
- **Classificacoes**: Historico das classificacoes com imagem, filtro por tipo e remocao

## Estrutura de Navegacao

```
Home
  ├── Ecopontos (lista)                          [F1]
  │     ├── DetalheEcoponto (detalhes + editar/excluir)
  │     │     └── EditarEcoponto (formulario de edicao)
  │     └── NovoEcoponto (formulario de criacao)
  ├── NovaClassificacao (camera/galeria + resultado)   [F3]
  └── Classificacoes (historico)                       [F3]
```

## Pre-requisitos

- Node.js 18+
- Expo CLI (`npx expo`)
- Backend do EcoFilter rodando (porta 8000)
- Expo Go no celular (para testar no dispositivo fisico)

## Configuracao da API

O arquivo `src/config.js` **detecta automaticamente** o IP do computador em desenvolvimento (Expo Go): reaproveita o endereco usado pelo celular para acessar o Metro bundler e monta a URL da API (`http://<ip>:8000`). Ao trocar de rede Wi-Fi, nao e preciso editar nada.

Se a deteccao falhar (ex: build de producao), ajuste o valor de `API_URL_FALLBACK` dentro do `config.js`. O backend precisa estar acessivel na porta 8000.

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
