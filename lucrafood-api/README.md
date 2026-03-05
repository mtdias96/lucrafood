# LucraFood API

API para gestao de custos, precificacao e lucratividade de produtos alimenticios. Permite calcular o custo real de producao com base nos ingredientes, definir precos de venda, acompanhar margens de lucro e simular cenarios de preco.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify
- **ORM:** Drizzle ORM (PostgreSQL)
- **Autenticacao:** JWT
- **Validacao:** Zod
- **DI:** Registry pattern com decorators

## Setup

```bash
# Instalar dependencias
pnpm install

# Configurar variaveis de ambiente
cp .env.example .env

# Gerar migrations
pnpm db:generate

# Aplicar migrations no banco
pnpm db:push

# Rodar em desenvolvimento
pnpm dev
```

## Scripts

| Comando | Descricao |
|---------|-----------|
| `pnpm dev` | Inicia o servidor em modo desenvolvimento |
| `pnpm typecheck` | Verificacao de tipos TypeScript |
| `pnpm db:generate` | Gera arquivos de migration (Drizzle Kit) |
| `pnpm db:push` | Aplica migrations no banco de dados |

## Arquitetura

```
src/
  application/
    controllers/     # Controllers com validacao via @Schema decorator
    entities/        # Entidades de dominio
    errors/          # Erros HTTP e de dominio
    service/         # Servicos de dominio (calculo financeiro, paginacao)
    usecases/        # Casos de uso (logica de negocio)
  infra/
    database/drizzle/
      schemas/       # Schemas do banco (Drizzle)
      repository/    # Repositorios (acesso a dados)
      mappers/       # Mapeamento entidade <-> row
  kernel/
    di/              # Container de injecao de dependencia
    decorators/      # @Injectable, @Schema
  main/
    routes/          # Rotas publicas e privadas (Fastify)
    factories/       # Factories para resolver controllers via DI
    adapters/        # Adaptadores Fastify <-> Controller
```

## Endpoints

### Autenticacao (publico)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/auth/signup` | Cadastro de usuario |
| POST | `/auth/signin` | Login (retorna JWT) |

### Ingredientes

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/ingredients` | Listar ingredientes (paginado) |
| GET | `/api/ingredients/:id` | Detalhe do ingrediente com estatisticas de preco (atual, min, max, media) |
| GET | `/api/ingredients/:id/purchases` | Historico de compras do ingrediente (paginado) |
| POST | `/api/ingredients` | Cadastrar ingrediente |
| POST | `/api/ingredients/:id/purchases` | Registrar compra de ingrediente |

### Produtos

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/products` | Listar produtos com receita (paginado) |
| POST | `/api/products` | Criar produto |
| PATCH | `/api/products/:id` | Editar produto (nome, rendimento, targetMargin) |
| PATCH | `/api/products/:id/sale-price` | Definir preco de venda |
| DELETE | `/api/products/:id` | Deletar produto |

### Receitas

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/products/:id/recipe` | Criar receita do produto |
| POST | `/api/products/:id/recipe-items` | Adicionar ingrediente a receita |
| PATCH | `/api/products/:id/recipe-items/:itemId` | Editar quantidade do ingrediente |
| DELETE | `/api/products/:id/recipe-items/:itemId` | Remover ingrediente da receita |

### Financeiro

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/products/financials` | Listar todos os produtos com dados financeiros |
| GET | `/api/products/:id/financials` | Financeiro detalhado de um produto |
| GET | `/api/products/:id/profit-history` | Historico de variacao de lucro |

Campos retornados no financeiro:
- `totalCost` - custo total da receita
- `unitCost` - custo por unidade produzida
- `grossProfit` - lucro bruto (salePrice - unitCost)
- `profitMargin` - margem de lucro (%)
- `suggestedPrice` - preco sugerido baseado na `targetMargin` (quando definida)

### Estoque

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/stock` | Listar estoque de ingredientes e produtos |
| PATCH | `/api/stock/ingredients/:id` | Atualizar estoque de ingrediente |
| PATCH | `/api/stock/products/:id` | Atualizar estoque de produto |
| POST | `/api/stock/products/:id/produce` | Produzir produto (deduz ingredientes do estoque) |

- O registro de compra de ingrediente incrementa o estoque automaticamente
- A producao de produto valida disponibilidade e deduz ingredientes via transacao

### Analytics

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/analytics/ingredients/:id/price-history` | Historico de preco de um ingrediente |
| GET | `/api/analytics/profit-history` | Historico global de lucro |
| GET | `/api/analytics/products/ranking` | Ranking de produtos por lucratividade |

### Simulacao de Preco

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/simulation/sale-price/:productId` | Simular novo preco de venda e ver impacto no lucro |
| POST | `/api/simulation/ingredient-price/:ingredientId` | Simular preco de ingrediente e ver impacto nos produtos |

**Simular preco de venda:**
```json
// POST /api/simulation/sale-price/:productId
{ "simulatedSalePrice": 25.00 }

// Retorna: financeiro atual vs simulado
```

**Simular preco de ingrediente:**
```json
// POST /api/simulation/ingredient-price/:ingredientId
{ "simulatedUnitPrice": 0.15 }

// Retorna: lista de produtos afetados com financeiro atual vs simulado
```

### Margem de Lucro Ideal

Defina uma margem desejada no produto e a API calcula automaticamente o preco de venda sugerido:

```json
// PATCH /api/products/:id
{ "product": { "targetMargin": 30 } }

// Em qualquer endpoint de financials, retorna:
// suggestedPrice = unitCost / (1 - targetMargin / 100)
```

Enviar `targetMargin: null` remove a margem desejada.

### Lojas

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/store` | Cadastrar loja |

### Usuario

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/me` | Dados do usuario autenticado |
