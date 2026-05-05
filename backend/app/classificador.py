"""
Classificador de residuos (F3) usando o modelo HuggingFace
prithivMLmods/Augmented-Waste-Classifier-SigLIP2.

O modelo e um SiglipForImageClassification fine-tuned em 10 classes:
Battery, Biological, Cardboard, Clothes, Glass, Metal, Paper, Plastic, Shoes, Trash.

Estrategia de carga:
- Modelo e processor sao carregados de forma "lazy" (no primeiro uso) e mantidos
  em memoria como singletons. Isso evita atrasar o startup da API e funciona bem
  no contexto de um servidor uvicorn de processo unico.
- Os pesos sao pre-baixados durante o build do Dockerfile, entao a primeira
  classificacao apenas instancia o modelo a partir do cache local.
"""

import io
import threading

import torch
from PIL import Image
from transformers import AutoImageProcessor, SiglipForImageClassification

MODEL_ID = "prithivMLmods/Augmented-Waste-Classifier-SigLIP2"

# Mapeamento das 10 classes do modelo para nossa categoria em PT-BR
# + orientacao de descarte exibida ao usuario.
MAPA_CLASSES: dict[str, dict[str, str]] = {
    "Battery": {
        "categoria": "bateria",
        "orientacao": (
            "Pilhas e baterias NAO podem ir no lixo comum (contem metais pesados). "
            "Leve a um ecoponto de logistica reversa, lojas de eletronicos ou "
            "supermercados que tenham coletor especifico."
        ),
    },
    "Biological": {
        "categoria": "organico",
        "orientacao": (
            "Residuo organico pode ir para compostagem domestica ou para a "
            "lixeira marrom (organico). Evite misturar com reciclaveis."
        ),
    },
    "Cardboard": {
        "categoria": "papelao",
        "orientacao": (
            "Desmonte e mantenha o papelao seco. Descarte na lixeira azul "
            "(reciclavel) ou em ecopontos que aceitem papel/papelao."
        ),
    },
    "Clothes": {
        "categoria": "textil",
        "orientacao": (
            "Roupas em bom estado podem ser doadas; pecas inservíveis podem ir "
            "para coletores de textil ou brechos solidarios. Evite o lixo comum."
        ),
    },
    "Glass": {
        "categoria": "vidro",
        "orientacao": (
            "Embale o vidro em jornal ou caixa para evitar acidentes e descarte "
            "na lixeira verde (reciclavel) ou em pontos especificos para vidro."
        ),
    },
    "Metal": {
        "categoria": "metal",
        "orientacao": (
            "Latas devem ser amassadas e lavadas antes do descarte. Use a lixeira "
            "amarela (reciclavel) ou ecopontos que aceitem metais."
        ),
    },
    "Paper": {
        "categoria": "papel",
        "orientacao": (
            "Mantenha o papel seco e limpo. Descarte na lixeira azul (reciclavel) "
            "ou em ecopontos que aceitem papel."
        ),
    },
    "Plastic": {
        "categoria": "plastico",
        "orientacao": (
            "Lave a embalagem para remover residuos, retire rotulos quando "
            "possivel e descarte na lixeira vermelha (reciclavel) ou em ecopontos "
            "que aceitem plasticos."
        ),
    },
    "Shoes": {
        "categoria": "calcado",
        "orientacao": (
            "Calcados em bom estado podem ser doados. Pares inservíveis podem ir "
            "para coletores de textil/calcado de algumas redes de varejo."
        ),
    },
    "Trash": {
        "categoria": "rejeito",
        "orientacao": (
            "Material classificado como rejeito (nao reciclavel). Descarte na "
            "lixeira cinza (rejeito comum). Reduza o consumo desse tipo de item."
        ),
    },
}


# Singletons carregados sob demanda
_model: SiglipForImageClassification | None = None
_processor: AutoImageProcessor | None = None
_lock = threading.Lock()


def _carregar_modelo():
    """Carrega modelo e processor uma unica vez, de forma thread-safe."""
    global _model, _processor
    if _model is None or _processor is None:
        with _lock:
            if _model is None or _processor is None:
                _processor = AutoImageProcessor.from_pretrained(MODEL_ID)
                _model = SiglipForImageClassification.from_pretrained(MODEL_ID)
                _model.eval()
    return _model, _processor


def classificar(nome_arquivo: str, conteudo: bytes) -> dict:
    """Recebe bytes da imagem e devolve dict com tipo, confianca e orientacao."""
    model, processor = _carregar_modelo()

    # carrega imagem (qualquer formato suportado pelo Pillow) e converte para RGB
    imagem = Image.open(io.BytesIO(conteudo)).convert("RGB")

    inputs = processor(images=imagem, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.nn.functional.softmax(logits, dim=1)
        idx = int(logits.argmax(-1).item())
        confianca = float(probs[0, idx].item())

    label_modelo = model.config.id2label[idx]
    info = MAPA_CLASSES.get(label_modelo, {
        "categoria": label_modelo.lower(),
        "orientacao": "Procure um ecoponto adequado para este tipo de residuo.",
    })

    return {
        "tipo_residuo": info["categoria"],
        "confianca": round(confianca, 4),
        "orientacao": info["orientacao"],
    }
