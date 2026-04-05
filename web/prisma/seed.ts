import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const posts = [
  {
    slug: "microservicios-go-nestjs",
    title: "Microservicios con Go y NestJS: Lecciones del mundo real",
    excerpt:
      "Qué aprendí liderando el backend de Paris App: cómo diseñar microservicios que escalen, cuándo usar gRPC vs REST, y los errores que no volvería a cometer.",
    content: `## El contexto

Llevo más de 3 años construyendo microservicios para el e-commerce de Cencosud. En ese tiempo pasé de copiar patrones de Stack Overflow a tomar decisiones de arquitectura que afectan millones de requests diarios.

Esta es una recopilación honesta de lo que funcionó, lo que no, y lo que haría diferente.

## gRPC vs REST: no es una guerra religiosa

La decisión más recurrente en microservicios es **cómo se comunican entre sí**. Mi regla práctica:

- **REST** para comunicación con el frontend o integraciones externas (SFCC, VTEX).
- **gRPC** para comunicación interna entre microservicios donde el performance importa.

Con gRPC en el servicio de carrito logramos reducir la latencia interna en ~40ms por request al eliminar la serialización JSON.

\`\`\`go
// Ejemplo: cliente gRPC en Go
conn, err := grpc.Dial(cartServiceAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
if err != nil {
    log.Fatalf("did not connect: %v", err)
}
defer conn.Close()

c := pb.NewCartServiceClient(conn)
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()

r, err := c.GetCart(ctx, &pb.GetCartRequest{UserId: userId})
\`\`\`

## El error más caro: acoplar demasiado temprano

En las primeras versiones del Home Headless, los servicios se llamaban directamente entre sí formando un grafo de dependencias. Un timeout en el servicio de precios tumbaba toda la página.

La solución fue introducir un **API Gateway** que agrega los datos y expone un contrato estable al frontend, mientras internamente usa circuit breakers para manejar fallos parciales.

## Kubernetes: el operador, no el mago

K8s no resuelve arquitectura mal diseñada. Lo que sí hace bien:

- **Rolling updates** sin downtime
- **Horizontal Pod Autoscaling** basado en métricas reales
- **ConfigMaps y Secrets** para separar config del código

El HPA fue clave durante campañas como CyberDay donde el tráfico se multiplicaba por 10x en minutos.

## Conclusión

Los microservicios son un trade-off: ganas en escalabilidad e independencia de despliegue, pero pagas en complejidad operacional. No los uses si tu equipo no está listo para operar esa complejidad.

El mejor microservicio es el que no necesitas escribir.`,
    tags: ["Go", "NestJS", "gRPC", "Kubernetes", "Microservicios"],
    published: true,
  },
  {
    slug: "agentes-ia-llms-2025",
    title: "Construyendo agentes IA con múltiples LLMs: Claude, GPT y Ollama",
    excerpt:
      "Cómo diseñé AgentAI Platform para orquestar agentes con herramientas personalizadas, y qué aprendí integrando Claude, DeepSeek, Ollama y Kokoro en el mismo pipeline.",
    content: `## Por qué un agente y no solo un chatbot

Un **chatbot** responde preguntas. Un **agente** ejecuta tareas: llama a APIs, consulta bases de datos, envía emails, corre comandos SSH.

La diferencia no es el modelo de lenguaje — es la arquitectura alrededor de él.

## El loop básico de un agente

\`\`\`
Usuario: "¿Cuántos posts publicamos esta semana?"

Agente:
  1. THINK: Necesito consultar la base de datos
  2. USE TOOL: query_database("SELECT COUNT(*) FROM posts WHERE ...")
  3. RESULT: 7 posts
  4. RESPOND: "Esta semana publicaron 7 posts."
\`\`\`

El modelo decide cuándo usar herramientas y cuáles. Nosotros definimos las herramientas disponibles.

## Multi-LLM: no todos los modelos son iguales

Cada modelo tiene fortalezas distintas:

| Modelo | Mejor para |
|--------|-----------|
| **Claude 3.5 Sonnet** | Razonamiento complejo, seguir instrucciones largas |
| **GPT-4o** | Visión, código, APIs de OpenAI |
| **DeepSeek-R1** | Razonamiento matemático, bajo costo |
| **Ollama (local)** | Privacidad, sin latencia de red, sin costos |

En AgentAI Platform implementamos un router que selecciona el modelo según la tarea.

## Kokoro TTS: voz para los agentes

[Kokoro](https://github.com/hexgrad/kokoro) es un modelo TTS open-source de alta calidad. Lo integramos para que los agentes puedan responder por voz en bots de Telegram.

\`\`\`typescript
async function textToSpeech(text: string): Promise<Buffer> {
  const response = await kokoro.generate({
    text,
    voice: "af_bella",
    speed: 1.0,
  })
  return response.audio
}
\`\`\`

## Lo que aprendí

1. **Prompt engineering importa más que el modelo**: un buen prompt con GPT-3.5 supera un mal prompt con GPT-4.
2. **El contexto es caro**: cada token en el contexto cuesta. Diseña herramientas que devuelvan solo lo necesario.
3. **Los agentes fallan con gracia**: implementa fallbacks y timeouts en cada herramienta.

El futuro no es un modelo más grande — es una mejor orquestación.`,
    tags: ["AI", "LLMs", "Claude", "Ollama", "Node.js", "Agentes"],
    published: true,
  },
  {
    slug: "fluxa-pagos-event-driven",
    title: "Diseñando un sistema de pagos con arquitectura event-driven",
    excerpt:
      "Los principios detrás de Fluxa: por qué elegí un ledger-first design, cómo manejar idempotencia en pagos, y las trampas que casi todo el mundo cae al procesar transacciones.",
    content: `## El problema de los pagos

Los pagos son un dominio donde los bugs cuestan dinero real. Un request procesado dos veces, una transacción perdida en un timeout, un estado inconsistente — todos estos escenarios tienen consecuencias directas.

Por eso diseñé Fluxa con tres principios fundamentales.

## Principio 1: Ledger-first

El estado financiero no se guarda en columnas \`balance\` que se actualizan. Se calcula a partir de **entradas inmutables en un ledger**.

\`\`\`sql
-- MAL: mutable balance
UPDATE accounts SET balance = balance - 100 WHERE id = 123;

-- BIEN: append-only ledger
INSERT INTO ledger_entries (account_id, amount, type, reference_id)
VALUES (123, -100, 'DEBIT', 'txn_abc123');
\`\`\`

Esto te da auditoría completa, reconstrucción de estado en cualquier punto del tiempo, y elimina race conditions en updates concurrentes.

## Principio 2: Idempotencia en todo

Cualquier operación de pago debe poder ejecutarse múltiples veces sin efectos secundarios adicionales.

\`\`\`go
type PaymentRequest struct {
    IdempotencyKey string \`json:"idempotency_key"\` // UUID generado por el cliente
    Amount         int64  \`json:"amount"\`
    Currency       string \`json:"currency"\`
    MerchantID     string \`json:"merchant_id"\`
}

func (s *PaymentService) ProcessPayment(ctx context.Context, req PaymentRequest) (*Payment, error) {
    // Si ya procesamos este key, devolvemos el resultado original
    existing, err := s.repo.FindByIdempotencyKey(ctx, req.IdempotencyKey)
    if err == nil {
        return existing, nil
    }
    // ... procesar nuevo pago
}
\`\`\`

## Principio 3: Event-driven para desacoplamiento

Cada transacción emite eventos que otros servicios consumen de forma asíncrona:

- \`payment.created\` → notificación al merchant
- \`payment.completed\` → actualizar dashboard
- \`payment.failed\` → reintentar o alertar

Esto permite que el servicio core de pagos sea simple y estable, mientras la lógica de negocio vive en consumers independientes.

## Tokenización PCI

Para cumplir con PCI-DSS, los datos de tarjeta nunca tocan nuestros servidores directamente. Usamos tokenización: el cliente envía los datos de tarjeta directo al vault, que devuelve un token que nuestro backend usa para cobrar.

## Conclusión

Un sistema de pagos robusto no es magia — es disciplina en los fundamentos: inmutabilidad, idempotencia, y separación de responsabilidades.`,
    tags: ["Go", "Pagos", "Event-driven", "PostgreSQL", "PCI", "Microservicios"],
    published: true,
  },
]

async function main() {
  console.log("🌱 Seeding database...")

  for (const post of posts) {
    const result = await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
    console.log(`  ✓ ${result.title}`)
  }

  console.log("✅ Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
