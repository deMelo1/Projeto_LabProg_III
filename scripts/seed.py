#!/usr/bin/env python3
"""
Popula o banco do EcoFilter com dados de exemplo (ecopontos e descartes)
via API REST. Util para demonstracoes.

Uso:
    python3 scripts/seed.py                      # usa http://localhost:8000
    API_URL=http://localhost:8000 python3 scripts/seed.py
"""
import json
import os
import urllib.request
import urllib.error

API_URL = os.environ.get("API_URL", "http://localhost:8000").rstrip("/")

ECOPONTOS = [
    {
        "nome": "EcoPonto Praca XV",
        "endereco": "Praca XV de Novembro, s/n",
        "cidade": "Rio de Janeiro", "estado": "RJ",
        "latitude": -22.9035, "longitude": -43.1739,
        "tipos_residuo": "Plástico, Vidro, Papel, Metal",
        "descricao": "Ponto central de coleta seletiva no Centro.",
    },
    {
        "nome": "EcoPonto Copacabana",
        "endereco": "Av. Atlantica, 1500",
        "cidade": "Rio de Janeiro", "estado": "RJ",
        "latitude": -22.9711, "longitude": -43.1822,
        "tipos_residuo": "Plástico, Vidro, Eletrônico",
        "descricao": "Recebe eletronicos de pequeno porte.",
    },
    {
        "nome": "EcoPonto Tijuca",
        "endereco": "Rua Conde de Bonfim, 800",
        "cidade": "Rio de Janeiro", "estado": "RJ",
        "latitude": -22.9249, "longitude": -43.2326,
        "tipos_residuo": "Papel, Metal, Orgânico",
        "descricao": "Compostagem de organicos disponivel.",
    },
    {
        "nome": "EcoPonto Barra da Tijuca",
        "endereco": "Av. das Americas, 5000",
        "cidade": "Rio de Janeiro", "estado": "RJ",
        "latitude": -23.0045, "longitude": -43.3650,
        "tipos_residuo": "Plástico, Vidro, Papel, Pilhas/Baterias",
        "descricao": "Coletor especifico para pilhas e baterias.",
    },
    {
        "nome": "EcoPonto Niteroi Centro",
        "endereco": "Rua da Conceicao, 100",
        "cidade": "Niterói", "estado": "RJ",
        "latitude": -22.8956, "longitude": -43.1227,
        "tipos_residuo": "Eletrônico, Metal, Óleo de cozinha",
        "descricao": "Descarte de oleo de cozinha usado.",
    },
    {
        "nome": "EcoPonto Petropolis",
        "endereco": "Rua do Imperador, 200",
        "cidade": "Petrópolis", "estado": "RJ",
        "latitude": -22.5050, "longitude": -43.1786,
        "tipos_residuo": "Papel, Vidro, Orgânico",
        "descricao": "Ponto de coleta na regiao serrana.",
    },
]

# (indice do ecoponto na lista acima, tipo de residuo, descricao)
DESCARTES = [
    (0, "Plástico", "3 garrafas PET"),
    (0, "Vidro", "Garrafas de vidro"),
    (0, "Papel", "Caixas de papelao"),
    (1, "Eletrônico", "Carregador antigo"),
    (1, "Plástico", "Embalagens diversas"),
    (2, "Orgânico", "Restos de alimentos para compostagem"),
    (2, "Metal", "Latas de aluminio"),
    (3, "Pilhas/Baterias", "Pilhas AA usadas"),
    (3, "Vidro", "Pote de vidro"),
    (3, "Plástico", "Sacolas plasticas"),
    (4, "Óleo de cozinha", "1 litro de oleo usado"),
    (4, "Eletrônico", "Mouse quebrado"),
    (5, "Papel", "Jornais e revistas"),
    (5, "Orgânico", "Cascas de frutas"),
]


def post(caminho, dados):
    req = urllib.request.Request(
        f"{API_URL}{caminho}",
        data=json.dumps(dados).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    print(f"Populando via {API_URL} ...")
    ids = []
    for e in ECOPONTOS:
        try:
            criado = post("/ecopontos", e)
            ids.append(criado["id"])
            print(f"  + ecoponto #{criado['id']}: {criado['nome']}")
        except urllib.error.URLError as err:
            print(f"  ! erro ao criar ecoponto '{e['nome']}': {err}")
            return

    n = 0
    for idx, tipo, desc in DESCARTES:
        if idx >= len(ids):
            continue
        try:
            post("/descartes", {
                "ecoponto_id": ids[idx],
                "tipo_residuo": tipo,
                "descricao": desc,
            })
            n += 1
        except urllib.error.URLError as err:
            print(f"  ! erro ao criar descarte ({tipo}): {err}")

    print(f"  + {n} descartes registrados")
    print("Concluido.")


if __name__ == "__main__":
    main()
