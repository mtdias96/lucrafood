# 🔌 Integração API - O que falta conectar no Frontend

> **Data**: 2026-03-11
> **Última atualização**: Baseado em análise da branch `feat/products-ingredients-refactor`

---

## 📊 Resumo Executivo

| Status | Serviços | Hooks | Páginas |
|--------|----------|-------|---------|
| ✅ Implementado | 4/10 | ~15+ | 6 |
| ⚠️ Parcial | - | - | - |
| ❌ Faltando | 6/10 | ~8+ | 4+ |

---

## ✅ O que JÁ está conectado

### Serviços de API Implementados

#### 1. **authService** (`src/app/services/authService.ts`)
- ✅ `POST /auth/signup` - Cadastro
- ✅ `POST /auth/signin` - Login
- ❌ `POST /auth/forgot-password` - Recuperação de senha
- ❌ `POST /auth/reset-password` - Reset de senha

#### 2. **ingredientService** (`src/app/services/ingredientService.ts`)
- ✅ `GET /ingredients` - Listar (paginado)
- ✅ `GET /ingredients/:id` - Detalhe com stats
- ✅ `POST /ingredients` - Criar
- ✅ `POST /ingredients/:id/purchases` - Registrar compra
- ❌ `GET /ingredients/:id/purchases` - Histórico de compras

#### 3. **productService** (`src/app/services/productService.ts`)
- ✅ `GET /products` - Listar
- ✅ `GET /products/financials` - Listar com financeiro
- ✅ `GET /products/:id/financials` - Detalhe financeiro
- ✅ `POST /products` - Criar
- ✅ `PATCH /products/:id` - Editar
- ✅ `PATCH /products/:id/sale-price` - Atualizar preço de venda
- ✅ `DELETE /products/:id` - Deletar
- ✅ `POST /products/:id/recipe` - Criar receita
- ✅ `POST /products/:id/recipe-items` - Adicionar itens na receita
- ❌ `PATCH /products/:id/recipe-items/:itemId` - Editar item da receita
- ❌ `DELETE /products/:id/recipe-items/:itemId` - Remover item da receita
- ❌ `GET /products/:id/profit-history` - Histórico de variação de lucro

#### 4. **storeService** (`src/app/services/storeService.ts`)
- ✅ `POST /store` - Criar
- ✅ `GET /store` - Listar
- ❌ `POST /api/ingredients-stores` - Associar ingrediente a loja

### Páginas/Rotas Implementadas
- ✅ Dashboard (`/`)
- ✅ Produtos (`/products`)
- ✅ Ingredientes (`/ingredients`)
- ✅ Detalhe de Ingrediente (`/ingredients/:id`)
- ✅ Lojas (`/stores`)
- ✅ Login (`/signin`)
- ✅ Cadastro (`/signup`)

---

## ❌ O que FALTA conectar

### 🏪 1. Controle de Estoque (Stock Management)

**Novo Serviço Necessário**: `stockService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/stock` | GET | Listar estoque (ingredientes + produtos com flag lowStock) | ❌ |
| `/stock/ingredients/:id` | PATCH | Atualizar estoque de ingrediente | ❌ |
| `/stock/products/:id` | PATCH | Atualizar estoque de produto | ❌ |
| `/stock/products/:id/produce` | POST | Produzir produto (deduz estoque automaticamente) | ❌ |

**O que implementar:**
```typescript
// stockService.ts
export const stockService = {
  getAll(params?: { page?: number; limit?: number }),
  updateIngredientStock(ingredientId: string, currentQty: number, minQty?: number),
  updateProductStock(productId: string, currentQty: number, minQty?: number),
  produceProduct(productId: string, qtyProduced: number),
}
```

**Páginas necessárias:**
- [ ] `/stock` - Dashboard de estoque (ver produtos/ingredientes com estoque baixo)
- [ ] Modal para atualizar estoque de ingrediente
- [ ] Modal para registrar produção de produto

---

### 📊 2. Analytics e Relatórios

**Novo Serviço Necessário**: `analyticsService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/analytics/ingredients/:id/price-history` | GET | Gráfico de variação de preço do ingrediente | ❌ |
| `/analytics/profit-history` | GET | Gráfico de variação do lucro ao longo do tempo | ❌ |
| `/analytics/products/ranking` | GET | Ranking de produtos por lucratividade | ❌ |
| `/reports/monthly` | GET | Relatório mensal com custos e lucros | ❌ |
| `/reports/monthly/pdf` | GET | Download de relatório em PDF | ❌ |
| `/reports/monthly/excel` | GET | Download de relatório em Excel | ❌ |

**O que implementar:**
```typescript
// analyticsService.ts
export const analyticsService = {
  getIngredientPriceHistory(ingredientId: string),
  getProfitHistory(period?: string),
  getProductsRanking(),
}

// reportsService.ts
export const reportsService = {
  getMonthlyReport(month: string), // YYYY-MM
  downloadMonthlyReportPDF(month: string),
  downloadMonthlyReportExcel(month: string),
}
```

**Páginas necessárias:**
- [ ] `/analytics` - Dashboard de análises com gráficos
- [ ] `/reports` - Página de relatórios com download PDF/Excel
- [ ] Componentes de gráfico reutilizáveis (lucide-react + biblioteca de gráficos)

---

### 🎮 3. Simulação de Preços

**Novo Serviço Necessário**: `simulationService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/simulation/sale-price` | POST | Simular aumento do preço de venda e ver impacto no lucro | ❌ |
| `/simulation/ingredient-price` | POST | Simular aumento de ingrediente e ver impacto na margem | ❌ |

**O que implementar:**
```typescript
// simulationService.ts
export const simulationService = {
  simulateSalePrice(productId: string, newPrice: number),
  simulateIngredientPrice(ingredientId: string, newPrice: number),
}
```

**Onde usar:**
- [ ] Modal de simulação dentro do detalhe do produto
- [ ] Modal de simulação dentro do detalhe do ingrediente

---

### 🔔 4. Alertas Inteligentes

**Novo Serviço Necessário**: `alertService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/alerts` | GET | Listar alertas do usuário (paginado, com unread count) | ❌ |
| `/alerts/check` | POST | Executar detecção de alertas | ❌ |
| `/alerts/:id/read` | PATCH | Marcar alerta como lido | ❌ |

**Tipos de alertas já implementados na API:**
- ✅ Ingrediente com aumento significativo (>= 10%)
- ✅ Produto deixou de ser lucrativo (custo > preço)
- ✅ Margem abaixo do ideal

**O que implementar:**
```typescript
// alertService.ts
export const alertService = {
  getAlerts(params?: { page?: number; limit?: number }),
  checkAlerts(),
  markAsRead(alertId: string),
}
```

**Componentes necessários:**
- [ ] Bell icon com unread count na navbar
- [ ] Modal/drawer com lista de alertas
- [ ] Toast de notificação quando novo alerta é gerado

---

### 🔑 5. Recuperação de Senha

**Extensão do Serviço**: `authService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/auth/forgot-password` | POST | Enviar link de recuperação por email | ❌ |
| `/auth/reset-password` | POST | Redefinir senha com token | ❌ |

**O que implementar:**
```typescript
// Adicionar a authService
export const authService = {
  // ... existing methods
  forgotPassword: async (email: string),
  resetPassword: async (token: string, newPassword: string),
}
```

**Páginas necessárias:**
- [ ] `/forgot-password` - Formulário para solicitar reset
- [ ] `/reset-password?token=xxx` - Formulário para definir nova senha

---

### 🧂 6. Melhorias em Ingredientes

**Extensão do Serviço**: `ingredientService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/ingredients/:id/purchases` | GET | Histórico de compras (paginado) | ❌ |

**Hook necessário:**
```typescript
// useIngredientPurchaseHistory.ts
export function useIngredientPurchaseHistory(ingredientId: string, params?: { page?: number; limit?: number })
```

**Onde usar:**
- [ ] Na página de detalhe do ingrediente, adicionar aba com histórico de compras

---

### 🍔 7. Edição de Itens de Receita

**Extensão do Serviço**: `productService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/products/:id/recipe-items/:itemId` | PATCH | Editar item da receita | ❌ |
| `/products/:id/recipe-items/:itemId` | DELETE | Remover item da receita | ❌ |

**Métodos necessários:**
```typescript
// Adicionar a productService
export const productService = {
  // ... existing methods
  updateRecipeItem(productId: string, itemId: string, data: UpdateRecipeItemParams),
  removeRecipeItem(productId: string, itemId: string),
}
```

**Onde usar:**
- [ ] Modal/inline edit na tabela de itens da receita
- [ ] Botão de deletar com confirmação

---

## 📈 Histórico de Lucro do Produto

**Extensão do Serviço**: `productService.ts`

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/products/:id/profit-history` | GET | Variação de lucro conforme custo de ingredientes | ❌ |

**Hook necessário:**
```typescript
// useProductProfitHistory.ts
export function useProductProfitHistory(productId: string)
```

**Onde usar:**
- [ ] Gráfico no detalhe do produto mostrando variação de lucro ao longo do tempo

---

## 🗺️ Mapa de Priorização

### 🔴 Alta Prioridade (Core do produto - deve vir AGORA)
1. **Stock Management** - Base para produção e controle
2. **Edição de Recipe Items** - Essencial para gerenciar produtos
3. **Alertas Inteligentes** - Valor imediato para o usuário
4. **Histórico de Lucro do Produto** - Diferencial competitivo

### 🟡 Média Prioridade (Próximas)
5. **Analytics & Relatórios** - Visualização de dados importante
6. **Simulação de Preços** - Ferramenta de planejamento
7. **Purchase History** - Complemento de ingredientes

### 🟢 Baixa Prioridade (Futuro)
8. **Password Recovery** - Segurança (pode usar email genérico no início)
9. **Ingredients-Stores** - Suporte multi-loja ainda não é prioridade

---

## 📋 Checklist de Implementação

### Fase 1 - Stock + Recipe Editing (CRÍTICO)
- [ ] Criar `stockService.ts` com 4 métodos
- [ ] Criar hooks: `useStock()`, `useUpdateIngredientStock()`, `useUpdateProductStock()`, `useProduceProduct()`
- [ ] Criar página `/stock`
- [ ] Estender `productService.ts` com `updateRecipeItem()` e `removeRecipeItem()`
- [ ] Atualizar UI de recipe items com botões edit/delete

### Fase 2 - Alertas (IMPORTANTE)
- [ ] Criar `alertService.ts` com 3 métodos
- [ ] Criar hooks: `useAlerts()`, `useCheckAlerts()`, `useMarkAlertAsRead()`
- [ ] Componente Bell icon na navbar com badge de unread
- [ ] Modal/drawer com lista de alertas
- [ ] Toast de notificação

### Fase 3 - Analytics (DIFERENCIAL)
- [ ] Criar `analyticsService.ts` com 3 métodos
- [ ] Criar `reportsService.ts` com 3 métodos
- [ ] Criar página `/analytics` com gráficos
- [ ] Criar página `/reports` com download
- [ ] Integrar biblioteca de gráficos (recharts, chart.js, visx)

### Fase 4 - Simulação (PLANEJAMENTO)
- [ ] Criar `simulationService.ts` com 2 métodos
- [ ] Criar modais de simulação dentro dos detalhes
- [ ] Componentes com input + preview de impacto

### Fase 5 - Melhorias (POLISH)
- [ ] Adicionar `getIngredientPurchaseHistory()` ao ingredientService
- [ ] Adicionar `getProfitHistory()` ao productService
- [ ] Criar páginas de forgot-password e reset-password
- [ ] Implementar `POST /api/ingredients-stores` (se necessário multi-loja)

---

## 🔧 Considerações Técnicas

### Estrutura de Pastas a Criar
```
src/
├── app/
│   ├── services/
│   │   ├── stockService.ts (novo)
│   │   ├── analyticsService.ts (novo)
│   │   ├── reportsService.ts (novo)
│   │   ├── simulationService.ts (novo)
│   │   ├── alertService.ts (novo)
│   │   └── [existentes]
│   ├── hooks/
│   │   ├── useStock.ts (novo)
│   │   ├── useAlerts.ts (novo)
│   │   ├── useAnalytics.ts (novo)
│   │   └── [existentes]
│   └── types/
│       ├── stock.ts (novo)
│       ├── alert.ts (novo)
│       ├── analytics.ts (novo)
│       └── [existentes]
│
└── view/
    ├── pages/
    │   ├── Stock/ (novo)
    │   ├── Analytics/ (novo)
    │   ├── Reports/ (novo)
    │   ├── ForgotPassword/ (novo)
    │   ├── ResetPassword/ (novo)
    │   └── [existentes]
    └── components/
        ├── AlertBell/ (novo)
        ├── AlertsDrawer/ (novo)
        └── [existentes]
```

### Dependências Potenciais a Adicionar
```json
{
  "recharts": "^2.x",  // ou visx/chart.js para gráficos
  "react-hot-toast": "^2.x",  // já existe ou adicionar para notifications
  "jspdf": "^2.x",  // para PDF (backend pode fazer)
  "exceljs": "^4.x"  // para Excel (backend pode fazer)
}
```

---

## 📝 Próximos Passos

1. **Validar Prioridades** - Confirmar com stakeholder quais fases fazer primeiro
2. **Implementar Fase 1** - Stock + Recipe editing são CRÍTICOS
3. **Testar Integração** - Cada serviço deve ser testado contra API real
4. **Documentar Types** - Garantir tipos TS estão 100% sincronizados com API
5. **Adicionar Testes** - Quando houver volume de integração

---

**Documento gerado**: 2026-03-11
**Branch analisada**: `feat/products-ingredients-refactor`
**Próxima atualização**: Após implementação da Fase 1
