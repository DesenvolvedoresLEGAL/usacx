# 📚 Documentação das Edge Functions - USAC

## 🎯 Funções Disponíveis

### 1. `generate-report`
Gera relatórios analíticos com cache inteligente.

**Endpoint:** `/functions/v1/generate-report`  
**Método:** POST  
**Autenticação:** Requerida

**Payload:**
```json
{
  "reportType": "attendance_summary" | "agent_performance" | "channel_distribution",
  "filters": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z"
  },
  "cacheMinutes": 60
}
```

**Response:**
```json
{
  "data": {
    // Dados do relatório específico
  },
  "cached": false,
  "generated_at": "2024-01-15T10:30:00Z"
}
```

**Tipos de Relatório:**

#### `attendance_summary`
Resumo geral de atendimentos
```json
{
  "total": 150,
  "finished": 120,
  "active": 20,
  "waiting": 10,
  "finishRate": "80.0"
}
```

#### `agent_performance`
Performance individual dos agentes
```json
{
  "agents": [
    {
      "agent_name": "João Silva",
      "total": 45,
      "finished": 40,
      "active": 5
    }
  ],
  "totalConversations": 150
}
```

#### `channel_distribution`
Distribuição por canal
```json
{
  "channels": [
    { "channel": "whatsapp", "count": 100 },
    { "channel": "webchat", "count": 50 }
  ]
}
```

---

### 2. `ai-suggest-response`
Gera 3 sugestões de resposta usando IA (Lovable AI - Gemini 2.5 Flash).

**Endpoint:** `/functions/v1/ai-suggest-response`  
**Método:** POST  
**Autenticação:** Opcional

**Payload:**
```json
{
  "conversationContext": "Cliente VIP - histórico de 5 compras",
  "clientMessage": "Olá, gostaria de informações sobre o produto X",
  "agentNotes": "Cliente sensível a preço"
}
```

**Response:**
```json
{
  "suggestions": [
    "Resposta profissional/formal...",
    "Resposta amigável/casual...",
    "Resposta empática/detalhada..."
  ],
  "model": "google/gemini-2.5-flash"
}
```

**Rate Limits:**
- 429: Limite de requisições excedido
- 402: Créditos esgotados (adicionar em Settings → Workspace → Usage)

---

### 3. `ai-summarize-conversation`
Gera resumo automático de uma conversa usando IA.

**Endpoint:** `/functions/v1/ai-summarize-conversation`  
**Método:** POST  
**Autenticação:** Requerida

**Payload:**
```json
{
  "conversationId": "uuid-da-conversa",
  "detailLevel": "brief" | "medium" | "detailed"
}
```

**Response:**
```json
{
  "summary": "Cliente solicitou informações sobre produto X. Agente forneceu detalhes sobre preço e prazo de entrega. Conversa finalizada com sucesso.",
  "conversationId": "uuid-da-conversa",
  "detailLevel": "medium",
  "client": "Maria Silva",
  "status": "finished",
  "messageCount": 8,
  "model": "google/gemini-2.5-flash"
}
```

**Níveis de Detalhe:**
- `brief`: 2-3 frases curtas
- `medium`: 1 parágrafo (padrão)
- `detailed`: Resumo completo com sentimento, próximos passos, etc.

---

## 🔐 Autenticação

Todas as funções que requerem autenticação devem incluir o header:

```
Authorization: Bearer <SUPABASE_ANON_KEY>
```

Para funções públicas (sem autenticação), configure no `config.toml`:

```toml
[functions.function-name]
verify_jwt = false
```

---

## 🧪 Testando as Funções

### Usando cURL

```bash
# generate-report
curl -X POST https://ssbjknpxmlcmkwsybntk.supabase.co/functions/v1/generate-report \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"reportType":"attendance_summary","filters":{}}'

# ai-suggest-response
curl -X POST https://ssbjknpxmlcmkwsybntk.supabase.co/functions/v1/ai-suggest-response \
  -H "Content-Type: application/json" \
  -d '{"conversationContext":"Teste","clientMessage":"Olá!","agentNotes":""}'

# ai-summarize-conversation
curl -X POST https://ssbjknpxmlcmkwsybntk.supabase.co/functions/v1/ai-summarize-conversation \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"<UUID>","detailLevel":"medium"}'
```

### Usando JavaScript/TypeScript

```typescript
import { supabase } from '@/integrations/supabase/client';

// Generate Report
const { data, error } = await supabase.functions.invoke('generate-report', {
  body: {
    reportType: 'attendance_summary',
    filters: { startDate: '2024-01-01T00:00:00Z' },
  },
});

// AI Suggest Response
const { data, error } = await supabase.functions.invoke('ai-suggest-response', {
  body: {
    conversationContext: 'Cliente VIP',
    clientMessage: 'Preciso de ajuda',
    agentNotes: 'Histórico positivo',
  },
});

// AI Summarize Conversation
const { data, error } = await supabase.functions.invoke('ai-summarize-conversation', {
  body: {
    conversationId: 'uuid-here',
    detailLevel: 'medium',
  },
});
```

---

## ⚡ Performance

- **Cache:** `generate-report` usa cache automático (padrão: 60 minutos)
- **Lovable AI:** Resposta típica < 2 segundos
- **Rate Limits:** Monitorar erros 429 (too many requests) e 402 (payment required)

---

## 🔧 Troubleshooting

### Erro 429 - Rate Limit
```
Solução: Aguardar alguns minutos ou implementar retry logic
```

### Erro 402 - Payment Required
```
Solução: Adicionar créditos em Settings → Workspace → Usage
```

### Erro 500 - Internal Server Error
```
Solução: Verificar logs da função em Lovable Cloud → Backend → Edge Functions
```

---

## 📊 Monitoramento

Todos os logs estão disponíveis em:
- **Lovable Cloud Dashboard** → Backend → Edge Functions → Logs
- **Audit Logs** na plataforma (tabela `audit_logs`)

---

**Última atualização:** 2025-11-29  
**Versão:** 1.0.0
