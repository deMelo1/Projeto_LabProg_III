# EcoFilter

Projeto da disciplina de **Laboratório de Programação 3**.

O **EcoFilter** é uma aplicação (web + mobile) pensada para ajudar no descarte correto de resíduos, permitindo:

- identificar o tipo de resíduo a partir de uma imagem;
- indicar pontos de coleta adequados para cada tipo de resíduo;
- registrar histórico de descartes e exibir métricas básicas de uso.

A proposta segue uma abordagem com **backend centralizado**, concentrando a lógica e atendendo tanto o sistema web quanto o app mobile.

---

## Funcionalidades principais (F1, F2, F3)

### F1 — Mapeamento e gestão de ecopontos (Completa)

Cadastro, consulta, edição e exclusão de pontos de coleta seletiva.
Permite **listagem** e **busca** de locais de descarte, com **filtro por tipo de resíduo** e suporte a **coordenadas geográficas** (latitude e longitude) para indicação de pontos mais próximos.

**Fluxo completo:**
1. Cadastrar um novo ecoponto com nome, endereço, cidade, UF, tipos de resíduo, coordenadas e descrição
2. Listar todos os ecopontos cadastrados com filtro por tipo de resíduo
3. Visualizar detalhes completos de um ecoponto específico
4. Editar os dados de um ecoponto existente
5. Excluir um ecoponto com confirmação

### F2 — Histórico e estatísticas de descarte (Completa)

Registra os descartes realizados pelo usuário e organiza essas informações em histórico.
Inclui exibição de **estatísticas simples de uso** para acompanhar a atividade ao longo do tempo.

**Fluxo completo:**
1. Registrar um descarte informando tipo de resíduo, ecoponto (opcional) e descrição
2. Listar todos os descartes registrados com filtro por tipo de resíduo
3. Visualizar estatísticas: total de descartes, distribuição por tipo e por mês

### F3 — Classificação de resíduos por imagem (Completa)

Funcionalidade central do projeto.
O sistema recebe uma **imagem do resíduo**, realiza a **classificação da categoria** e retorna uma **orientação de descarte**. Cada classificação é **persistida no banco** com o tipo identificado, a confiança e a orientação. O histórico fica disponível em uma tela própria.

**Fluxo completo:**
1. Acessar **"Nova Classificacao"** no menu
2. Selecionar uma imagem do resíduo (PNG, JPG, JPEG, WEBP, GIF ou BMP, até 8 MB)
3. Visualizar o preview e clicar em **"Classificar"**
4. Receber a categoria (`bateria`, `organico`, `papelao`, `textil`, `vidro`, `metal`, `papel`, `plastico`, `calcado` ou `rejeito`) com a confiança e a orientação de descarte
5. Conferir o histórico em **"Classificacoes"** com a imagem original, filtro por tipo e opção de remover

> **Sobre o classificador:** a classificação é feita pelo modelo **[`prithivMLmods/Augmented-Waste-Classifier-SigLIP2`](https://huggingface.co/prithivMLmods/Augmented-Waste-Classifier-SigLIP2)** (HuggingFace), um SigLIP2 fine-tuned para 10 classes de resíduo: *Battery, Biological, Cardboard, Clothes, Glass, Metal, Paper, Plastic, Shoes, Trash*. O modelo roda em CPU dentro do container do backend e os pesos (~370 MB) são pré-baixados durante o `docker compose build`. Cada classe é mapeada para uma categoria PT-BR (`bateria`, `organico`, `papelao`, `textil`, `vidro`, `metal`, `papel`, `plastico`, `calcado`, `rejeito`) com sua respectiva orientação de descarte.

> **Observação:** a funcionalidade definida para implementação no aplicativo mobile é a **F3 (classificação por imagem)**, para aproveitar a câmera do celular como diferencial.

---

## Tecnologias

### Backend

- **FastAPI (Python)**

### Banco de dados

- **PostgreSQL**

### Frontend (Web)

- **React** com **React Router DOM**
- **Vite** (dev server e build)

### Mobile

- **React Native**

---

## Estrutura do repositório

```
/
├── backend/
├── frontend/
├── mobile/
├── postman/
├── docker-compose.yml
└── README.md
```

## Como subir o ambiente (Docker Compose)

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Acesse:

- **Frontend:** http://localhost:5173 (React/Vite)
- **Backend:** http://localhost:8000 (FastAPI)
- **Swagger (docs da API):** http://localhost:8000/docs
- **Healthcheck:** http://localhost:8000/health

---

## Como derrubar o ambiente

```bash
docker compose down
```

---

## Banco de dados

O sistema usa **PostgreSQL 16** rodando via Docker. As credenciais padrão estão no `docker-compose.yml`:

- **Usuário:** eco
- **Senha:** eco
- **Database:** ecofilter
- **Porta:** 5432

As tabelas são criadas automaticamente pelo backend na primeira execução.

### Entidades

| Tabela            | Descrição                                            | Status        |
| ----------------- | ---------------------------------------------------- | ------------- |
| `ecopontos`       | Pontos de coleta seletiva                            | CRUD completo |
| `descartes`       | Registros de descarte feitos pelo usuário            | CRUD completo |
| `classificacoes`  | Histórico de classificações de imagens (F3)          | CRUD completo |

---

## Frontend (Web)

O frontend roda em **React** com **Vite** dentro de um container Docker, acessível em `http://localhost:5173`.

### Telas

| Rota                    | Tela              | Descrição                                                       |
| ----------------------- | ----------------- | --------------------------------------------------------------- |
| `/`                     | Inicio            | Tela inicial com descrição das funcionalidades e status da API  |
| `/ecopontos`            | Ecopontos         | Lista os ecopontos com filtro por tipo de resíduo               |
| `/ecopontos/:id`        | Detalhe Ecoponto  | Exibe todos os dados de um ecoponto com opções de editar/excluir|
| `/novo-ecoponto`        | Novo Ecoponto     | Formulário para cadastrar novo ponto de coleta (com lat/lng)    |
| `/editar-ecoponto/:id`  | Editar Ecoponto   | Formulário para alterar dados de um ecoponto existente          |
| `/descartes`            | Descartes         | Lista o histórico de descartes com filtro por tipo de resíduo   |
| `/novo-descarte`        | Novo Descarte     | Formulário para registrar um descarte realizado                 |
| `/estatisticas`         | Estatísticas      | Total de descartes, distribuição por tipo e por mês             |
| `/nova-classificacao`   | Nova Classificacao| Upload de imagem com retorno do tipo de resíduo e orientação    |
| `/classificacoes`       | Classificacoes    | Histórico de classificações com imagem, filtro e remoção        |

### Navegação

O sistema possui um **menu de navegação (navbar)** no topo com links para as telas principais. Na listagem, cada linha da tabela é clicável e leva ao detalhe do ecoponto.

### Consumo da API

O frontend consome os seguintes endpoints do backend:

| Endpoint            | Método | Tela que consome  | Descrição                              |
| ------------------- | ------ | ----------------- | -------------------------------------- |
| `/health`           | GET    | Inicio            | Exibe o status da API                  |
| `/ecopontos`        | GET    | Ecopontos         | Lista ecopontos (com filtro opcional)  |
| `/ecopontos/{id}`   | GET    | Detalhe Ecoponto  | Obtém dados de um ecoponto específico  |
| `/ecopontos`        | POST   | Novo Ecoponto     | Cadastra um novo ecoponto              |
| `/ecopontos/{id}`   | PUT    | Editar Ecoponto   | Atualiza dados de um ecoponto          |
| `/ecopontos/{id}`   | DELETE | Detalhe Ecoponto  | Remove um ecoponto                     |
| `/descartes`        | GET    | Descartes         | Lista descartes (com filtro opcional)  |
| `/descartes`        | POST   | Novo Descarte     | Registra um novo descarte              |
| `/ecopontos`        | GET    | Novo Descarte     | Popula o dropdown de ecopontos         |
| `/descartes/estatisticas` | GET | Estatísticas | Dados para os gráficos de estatísticas |
| `/classificacao`              | POST   | Nova Classificacao | Envia imagem (multipart) e recebe a classificação |
| `/classificacao`              | GET    | Classificacoes     | Lista o histórico (com filtro opcional)           |
| `/classificacao/{id}/imagem`  | GET    | Classificacoes     | Serve a imagem original da classificação          |
| `/classificacao/{id}`         | DELETE | Classificacoes     | Remove uma classificação do histórico             |

---

## API — Endpoints

### Status

| Método | Rota      | Descrição                |
| ------ | --------- | ------------------------ |
| GET    | `/health` | Verifica se a API está no ar |

### F1 — Ecopontos (CRUD completo)

| Método | Rota                | Descrição                                          |
| ------ | ------------------- | -------------------------------------------------- |
| GET    | `/ecopontos`        | Lista todos os ecopontos (aceita `?tipo_residuo=`) |
| GET    | `/ecopontos/{id}`   | Retorna um ecoponto específico                     |
| POST   | `/ecopontos`        | Cadastra um novo ecoponto                          |
| PUT    | `/ecopontos/{id}`   | Atualiza um ecoponto existente                     |
| DELETE | `/ecopontos/{id}`   | Remove um ecoponto                                 |

### F2 — Descartes (completo)

| Método | Rota                      | Descrição                                           |
| ------ | ------------------------- | --------------------------------------------------- |
| GET    | `/descartes`              | Lista histórico de descartes (aceita `?tipo_residuo=`) |
| POST   | `/descartes`              | Registra um novo descarte                           |
| GET    | `/descartes/estatisticas` | Retorna total, descartes por tipo e por mês         |

### F3 — Classificação (completo)

| Método | Rota                            | Descrição                                                |
| ------ | ------------------------------- | -------------------------------------------------------- |
| POST   | `/classificacao`                | Classifica resíduo a partir de imagem (multipart/form-data, campo `arquivo`) |
| GET    | `/classificacao`                | Lista o histórico (aceita `?tipo_residuo=`)              |
| GET    | `/classificacao/{id}`           | Retorna uma classificação específica                     |
| GET    | `/classificacao/{id}/imagem`    | Devolve a imagem original (binário)                      |
| DELETE | `/classificacao/{id}`           | Remove uma classificação (e a imagem associada)          |

---

## Fluxo completo da F1 (passo a passo)

1. Suba o ambiente com `docker compose up --build`
2. Acesse http://localhost:5173 — a Home exibe o status da API (deve estar verde/ok)
3. Clique em **"Novo Ecoponto"** no menu e preencha o formulário para cadastrar um ponto de coleta
4. Clique em **"Ecopontos"** no menu para ver a listagem de todos os ecopontos cadastrados
5. Use o campo de filtro para buscar por tipo de resíduo (ex: "plástico")
6. Clique em uma linha da tabela para ver os **detalhes** do ecoponto
7. Na tela de detalhes, clique em **"Editar"** para alterar os dados
8. Na tela de detalhes, clique em **"Excluir"** para remover o ecoponto (com confirmação)

Todos os dados são persistidos no PostgreSQL e sobrevivem a reinicializações do container (volume `db_data`).

---

## Fluxo completo da F2 (passo a passo)

1. Suba o ambiente com `docker compose up --build`
2. Cadastre pelo menos um ecoponto (se ainda não tiver) via **"Novo Ecoponto"**
3. Clique em **"Novo Descarte"** no menu e registre alguns descartes variando os tipos de resíduo
4. Clique em **"Descartes"** no menu para ver o histórico completo
5. Use o campo de filtro para buscar por tipo de resíduo (ex: "plastico")
6. Clique em **"Estatisticas"** no menu para ver o total, a distribuição por tipo e a tabela por mês

---

## Fluxo completo da F3 (passo a passo)

1. Suba o ambiente com `docker compose up --build`
2. Acesse http://localhost:5173 e clique em **"Nova Classificacao"** no menu
3. Selecione uma imagem do resíduo (PNG/JPG/JPEG/WEBP/GIF/BMP, até 8 MB) — o preview aparece logo abaixo
4. Clique em **"Classificar"**: a API recebe o arquivo, salva em volume Docker (`uploads_data`), classifica e persiste o registro
5. O resultado aparece com o **tipo de resíduo**, a **confiança** e a **orientação de descarte**
6. Acesse **"Classificacoes"** no menu para ver todo o histórico em cards com a imagem, data, tipo e orientação
7. Use o filtro por tipo (ex: `plastico`) para restringir a listagem
8. Use o botão **"Remover"** em qualquer card para excluir o registro e a imagem do servidor

> **Sobre desempenho:** o build do backend é mais demorado da primeira vez (instala torch CPU + pesos do modelo SigLIP2). A primeira classificação após o container subir também leva alguns segundos para carregar o modelo em memória; chamadas seguintes ficam rápidas (< 1s em CPU).

---

## Teste de endpoints pelo Postman

As coleções do Postman estão na pasta `postman/`:

| Arquivo                                            | Funcionalidade        |
| -------------------------------------------------- | --------------------- |
| `EcoFilter_Ecopontos.postman_collection.json`      | F1 — Ecopontos        |
| `EcoFilter_Descartes.postman_collection.json`      | F2 — Descartes        |
| `EcoFilter_Classificacao.postman_collection.json`  | F3 — Classificação    |

---

## Capturas de Tela

As capturas de tela das funcionalidades implementadas devem ser salvas na pasta `docs/screenshots/` com os seguintes nomes:

| Arquivo                      | Descrição                                      |
| ---------------------------- | ---------------------------------------------- |
| `01_home.png`                | Tela inicial com status da API                 |
| `02_novo_ecoponto.png`       | Formulário de cadastro preenchido              |
| `03_listagem_ecopontos.png`  | Listagem de ecopontos cadastrados              |
| `04_filtro_residuo.png`      | Listagem filtrada por tipo de resíduo          |
| `05_detalhe_ecoponto.png`    | Tela de detalhes de um ecoponto                |
| `06_editar_ecoponto.png`     | Formulário de edição preenchido                |
| `07_swagger_api.png`         | Documentação Swagger da API (localhost:8000/docs) |
| `08_novo_descarte.png`       | Formulário de registro de descarte preenchido     |
| `09_listagem_descartes.png`  | Histórico de descartes registrados                |
| `10_filtro_descartes.png`    | Histórico filtrado por tipo de resíduo            |
| `11_estatisticas.png`        | Tela de estatísticas com total e gráficos         |
| `12_swagger_descartes.png`   | Documentação Swagger dos endpoints de descartes (F2) |
| `13_nova_classificacao.png`  | Tela de envio de imagem com preview               |
| `14_resultado_classificacao.png` | Resultado da classificação com tipo, confiança e orientação |
| `15_classificacoes_historico.png` | Histórico de classificações em cards         |
| `16_filtro_classificacoes.png` | Histórico filtrado por tipo de resíduo          |
