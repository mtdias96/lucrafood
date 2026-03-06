# LucraFood - Frontend

Frontend da aplicação LucraFood desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui.

## 🛠️ Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## 📦 Instalação

```bash
npm install
```

## 🚀 Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   └── ui/           # Componentes shadcn/ui
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks
├── services/         # Serviços (API, auth, etc)
├── types/            # Tipos TypeScript
├── utils/            # Funções utilitárias
├── App.tsx           # Componente raiz
├── main.tsx          # Entry point
└── index.css         # Estilos globais
```

## 🎨 Usando shadcn/ui

Para adicionar um novo componente shadcn/ui:

```bash
npx shadcn-ui@latest add [component-name]
```

Exemplo:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

## 🏗️ Build

```bash
npm run build
```

## 🧪 Testes

```bash
npm run test
```

## 📝 Licença

MIT
