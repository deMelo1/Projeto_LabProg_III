#!/usr/bin/env bash
# Sobe os containers e roda o seed inicial.
set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
    echo "Falta o .env na raiz. Copia do .env.example e ajusta."
    exit 1
fi

set -a
. ./.env
set +a

echo "Subindo containers..."
docker compose up -d --build

echo "Esperando o backend subir..."
for i in $(seq 1 120); do
    if curl -sf "http://localhost:${BACKEND_PORT}/health" > /dev/null 2>&1; then
        echo "Backend ok."
        break
    fi
    if [ "$i" = "120" ]; then
        echo "Backend nao respondeu. Confere docker compose logs backend."
        exit 1
    fi
    sleep 2
done

echo "Carregando dados iniciais..."
docker compose exec -T backend python scripts/seed_data.py

echo ""
echo "Pronto. Acesse http://<IP_DO_SERVIDOR>:${FRONTEND_PORT}"
