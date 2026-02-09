# 🍔 LucraFood

Plataforma para **controle de custos, margem e precificação** de produtos alimentícios, usando **histórico de preços de ingredientes** para gerar **insights e alertas** (ex: variação alta de custo e impacto na margem).  
O projeto é um **MVP de portfólio** com **API + Web Admin + App Mobile (React Native)**.

> Status: 🚧 Em desenvolvimento (MVP)

---

## ✨ Principais Features (MVP)
- Autenticação (JWT + Refresh Token) + `/me`
- CRUD de **Ingredientes** com **histórico de preços**
- CRUD de **Produtos** e **Receitas** (produto ↔ ingredientes)
- Serviço de **cálculo de custo** do produto (último preço ou média)
- Cálculo de **margem** e suporte a **preço de venda**
- Dashboard com **insights** (mais lucrativos, margem abaixo do alvo, variação de ingredientes)
- **Alertas inteligentes** por variação de preço (heurística)
- Plano **FREE/PRO (mock)** para demonstrar controle de acesso

---

## 🧱 Arquitetura e Stack
**Backend**
- Node.js + TypeScript + Fastify
- Drizzle + Postgres
- Zod (validação)
- JWT (access/refresh)
- Logger estruturado + request-id + error handler global
- Testes de integração (foco em regras de negócio)

**Frontend (Admin Web)**
- Em breve: painel para gerenciar ingredientes/produtos, preços e dashboard

**Mobile (React Native)**
- Em breve: visão simplificada e consultas rápidas

---

## 🗺️ Roadmap (Backend)

O backlog está organizado por fases:
 
- **Fase 0** — Fundação do Backend ✅
- **Fase 1** — Autenticação e Usuários ✅ 
- **Fase 2** — Ingredientes + Histórico de Preços ✅
- **Fase 3** — Produtos + Receitas  (Andamento)
- **Fase 4** — Cálculo de Custos e Margem  
- **Fase 5** — Dashboard e Insights  
- **Fase 6** — Gráficos  
- **Fase 7** — Plano Pro (Mock)  
- **Fase 8** — Qualidade e Produção  
