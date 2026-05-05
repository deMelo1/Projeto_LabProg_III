FROM python:3.11-slim

WORKDIR /app

# torch CPU-only (evita baixar gigabytes de wheels com CUDA)
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.4.1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# pre-baixa os pesos do modelo de classificacao para o cache do HF
# (evita download na primeira requisicao)
ENV HF_HOME=/root/.cache/huggingface
RUN python -c "from transformers import AutoImageProcessor, SiglipForImageClassification; m='prithivMLmods/Augmented-Waste-Classifier-SigLIP2'; AutoImageProcessor.from_pretrained(m); SiglipForImageClassification.from_pretrained(m)"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
