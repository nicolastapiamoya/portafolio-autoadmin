#!/bin/sh
# Script para inicializar Ollama y descargar el modelo Gemma 4

MODEL="${OLLAMA_MODEL:-gemma:2b}"
OLLAMA_HOST="${OLLAMA_HOST:-http://ollama:11434}"

echo "⏳ Esperando a que Ollama esté disponible..."

# Esperar a que Ollama esté listo
until curl -s ${OLLAMA_HOST}/api/tags > /dev/null 2>&1; do
    sleep 2
done

echo "✅ Ollama está listo"
echo "📥 Descargando modelo: $MODEL"

# Descargar el modelo
curl -X POST ${OLLAMA_HOST}/api/pull \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"$MODEL\"}"

echo ""
echo "✅ Modelo $MODEL descargado y listo para usar"
