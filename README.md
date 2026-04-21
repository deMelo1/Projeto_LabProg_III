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

### F3 — Classificação de resíduos por imagem

Funcionalidade central do projeto.
O sistema recebe uma **imagem do resíduo**, realiza a **classificação da categoria** e retorna uma **orientação de descarte**.
O app mobile atua como interface de **captura da imagem** e **envio para a API**.

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

| Tabela      | Descrição                                 | Status        |
| ----------- | ----------------------------------------- | ------------- |
| `ecopontos` | Pontos de coleta seletiva                 | CRUD completo |
| `descartes` | Registros de descarte feitos pelo usuário | CRUD completo |

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

### F3 — Classificação (em construção)

| Método | Rota             | Descrição                              |
| ------ | ---------------- | -------------------------------------- |
| POST   | `/classificacao` | Classifica resíduo a partir de imagem  |

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

## Teste de endpoints pelo Postman

As coleções do Postman estão na pasta `postman/`:

| Arquivo                                            | Funcionalidade |
| -------------------------------------------------- | -------------- |
| `EcoFilter_Ecopontos.postman_collection.json`      | F1 — Ecopontos |
| `EcoFilter_Descartes.postman_collection.json`      | F2 — Descartes |

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
