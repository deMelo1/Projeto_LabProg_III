# Backend

API REST do **EcoFilter**, construída com **FastAPI** (Python).

---

## Como executar

### Com Docker (recomendado)

Na raiz do projeto:

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:8000`.

### Localmente (sem Docker)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Documentação interativa

O FastAPI gera documentação automática acessível em:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Endpoints da API

### Status

| Método | Rota       | Descrição                     |
|--------|------------|-------------------------------|
| GET    | `/health`  | Healthcheck — verifica se a API está no ar |

### F1 — Ecopontos (pontos de coleta)

| Método | Rota                    | Descrição                                  |
|--------|-------------------------|--------------------------------------------|
| GET    | `/ecopontos`            | Lista pontos de coleta (aceita `?tipo_residuo=` para filtro) |
| GET    | `/ecopontos/{id}`       | Retorna dados de um ponto de coleta        |
| POST   | `/ecopontos`            | Cadastra um novo ponto de coleta           |
| PUT    | `/ecopontos/{id}`       | Atualiza um ponto de coleta                |
| DELETE | `/ecopontos/{id}`       | Remove um ponto de coleta                  |

### F2 — Histórico e estatísticas de descarte

| Método | Rota                        | Descrição                                    |
|--------|-----------------------------|----------------------------------------------|
| GET    | `/descartes`                | Lista o histórico de descartes do usuário    |
| POST   | `/descartes`                | Registra um novo descarte                    |
| GET    | `/descartes/estatisticas`   | Retorna estatísticas simples de uso          |

### F3 — Classificação de resíduos por imagem

| Método | Rota              | Descrição                                                     |
|--------|--------------------|---------------------------------------------------------------|
| POST   | `/classificacao`   | Recebe imagem de resíduo e retorna classificação e orientação |

---

## Banco de dados

O backend se conecta ao PostgreSQL usando **SQLAlchemy** como ORM. A URL de conexão vem da variável de ambiente `DATABASE_URL`, definida no `docker-compose.yml`.

As tabelas são criadas automaticamente quando a aplicação inicia (via `Base.metadata.create_all`).

### Estrutura dos arquivos

```
app/
├── main.py        # endpoints da API
├── database.py    # conexão com o banco (engine, sessão)
├── models.py      # modelos das tabelas (SQLAlchemy)
├── schemas.py     # schemas de validação (Pydantic)
└── crud.py        # funções de acesso ao banco
```

### Entidades

**Ecoponto** (tabela `ecopontos`)

| Campo          | Tipo         | Observação                |
|----------------|--------------|---------------------------|
| id             | Integer (PK) | autoincremento            |
| nome           | String(150)  | obrigatório               |
| endereco       | String(255)  | obrigatório               |
| cidade         | String(100)  | obrigatório               |
| estado         | String(2)    | UF, ex: "SP"              |
| latitude       | Float        | opcional                  |
| longitude      | Float        | opcional                  |
| tipos_residuo  | String(255)  | separado por vírgula      |
| descricao      | Text         | opcional                  |
| criado_em      | DateTime     | preenchido automaticamente |

**Descarte** (tabela `descartes`)

| Campo          | Tipo         | Observação                 |
|----------------|--------------|----------------------------|
| id             | Integer (PK) | autoincremento             |
| ecoponto_id    | Integer (FK) | referência para ecopontos  |
| tipo_residuo   | String(50)   | obrigatório                |
| descricao      | String(255)  | opcional                   |
| data_descarte  | DateTime     | preenchido automaticamente |

---

## Tecnologias

- **FastAPI** — framework web
- **Uvicorn** — servidor ASGI
- **PostgreSQL** — banco de dados (via Docker)
- **SQLAlchemy** — ORM
- **psycopg2** — driver PostgreSQL para Python
