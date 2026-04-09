#!/bin/bash
# Script para inicializar Ollama y descargar el modelo Gemma 3 4B

MODEL="${OLLAMA_MODEL:-gemma4:e2b}"

echo "⏳ Esperando a que Ollama esté disponible..."

# Esperar a que Ollama esté listo
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
    sleep 2
done

echo "✅ Ollama está listo"
echo "📥 Descargando modelo: $MODEL"

# Descargar el modelo
curl -X POST http://localhost:11434/api/pull \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"$MODEL\"}"

echo ""
echo "✅ Modelo $MODEL descargado y listo para usar"
