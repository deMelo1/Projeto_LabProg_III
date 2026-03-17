# EcoFilter

Projeto da disciplina de **Laboratório de Programação 3**.

O **EcoFilter** é uma aplicação (web + mobile) pensada para ajudar no descarte correto de resíduos, permitindo:

- identificar o tipo de resíduo a partir de uma imagem;
- indicar pontos de coleta adequados para cada tipo de resíduo;
- registrar histórico de descartes e exibir métricas básicas de uso.

A proposta segue uma abordagem com **backend centralizado**, concentrando a lógica e atendendo tanto o sistema web quanto o app mobile.

---

## Funcionalidades principais (F1, F2, F3)

### F1 — Mapeamento e gestão de ecopontos

Cadastro e consulta de pontos de coleta seletiva.  
Permite **listagem** e **busca** de locais de descarte, com **filtro por tipo de resíduo** e, quando aplicável, **indicação de pontos mais próximos**.

### F2 — Histórico e estatísticas de descarte

Registra os descartes realizados pelo usuário e organiza essas informações em histórico.  
Inclui exibição de **estatísticas simples de uso** para acompanhar a atividade ao longo do tempo.

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

- **React**

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

| Tabela       | Descrição                                    | Status       |
|--------------|----------------------------------------------|--------------|
| `ecopontos`  | Pontos de coleta seletiva                    | CRUD pronto  |
| `descartes`  | Registros de descarte feitos pelo usuário    | Modelo criado |

