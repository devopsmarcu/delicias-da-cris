# Contexto do Projeto: Delícias da Cris

Aplicação de **cardápio digital com sistema de pedidos** para a "Delícias da Cris". Evoluída de landing page → app interativa → app com roteamento e UX mobile-first. Permite que clientes montem pedidos com controle fino de quantidade e os enviem diretamente ao WhatsApp.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Semântico e acessível (`aria-label`, `role`, `aria-live`).
- **CSS3 (Vanilla)**: Mobile-first com `clamp()`, CSS Custom Properties, Flexbox e Grid.
- **JavaScript (ES Modules)**: Arquitetura modular com separação clara de responsabilidades.
- **Web Storage API**: `localStorage` para persistência do carrinho entre sessões e rotas.

## 📂 Estrutura de Pastas

```text
/
├── assets/
│   ├── images/
│   │   └── logo.png              # Logo circular da marca
│   ├── scripts/
│   │   ├── utils/
│   │   │   └── dom.js            # Helper: ready()
│   │   ├── cart.js               # Lógica do carrinho (addItem, removeItem, persist)
│   │   ├── menu.js               # Dados do cardápio (preço UNITÁRIO por item)
│   │   ├── ui.js                 # Roteamento por hash + renderização + eventos
│   │   ├── whatsapp.js           # Geração do link wa.me com mensagem formatada
│   │   └── main.js               # Bootstrap (Cart + UI)
│   └── styles/
│       └── main.css              # CSS mobile-first completo com design tokens
├── index.html                    # SPA com roteamento por hash (#simples, #especiais…)
└── contexto.md                   # Este documento
```

## 🗺️ Sistema de Rotas (Hash-based)

| Hash | Tela |
|---|---|
| `#home` ou vazio | Página inicial com grade de categorias |
| `#simples` | Salgados Simples |
| `#especiais` | Salgados Especiais |
| `#tortas-salgadas` | Tortas Salgadas |
| `#bolos-simples` | Bolos Simples |

A navegação é tratada via `window.location.hash` + evento `hashchange`. A bottom navigation destaca a categoria ativa automaticamente.

## 🚀 Funcionalidades Principais

1. **Roteamento por Hash**: Cada categoria tem sua própria rota (`#simples`, `#especiais`, etc.). Carrinho é global e persistente entre rotas via `localStorage`.
2. **Preço Unitário**: Cada item exibe seu preço por unidade. O subtotal (`qtd × preço`) é atualizado em tempo real.
3. **Controles de Quantidade Avançados**: Botões `+` e `−` para adição unitária. Botões rápidos `+10`, `+25`, `+50`, `+100` e inversos para pedidos em lote.
4. **Carrinho Global Persistente**: Funciona entre todas as rotas/categorias. Salvo no `localStorage`.
5. **Checkout via WhatsApp**: Mensagem formatada com todos os itens, quantidades e total.
6. **Bottom Navigation (Mobile)**: Navegação entre categorias fixada na base da tela.

## 🎨 Guia de Estilo (Design Tokens)

```css
--brand-primary: #ff887d;       /* Coral */
--brand-primary-dark: #e56f64;
--brand-secondary: #45271d;     /* Marrom Café */
--accent-soft: #ffe1de;         /* Rosa claro */
--cream: #fff7ed;               /* Fundo creme */
--text: #2a2a2a;
--muted: #7a7a7a;
--card: #ffffff;
```

## 📌 Status Atual

Versão **3.0 (Mobile-First + Rotas)**. A UI é renderizada dinamicamente com base na rota ativa. Para atualizar preços ou adicionar itens, editar apenas `menu.js`.

> **Importante:** O projeto usa ES Modules, portanto precisa ser servido via servidor HTTP (não funciona com `file://` diretamente). Use Live Server, `npx serve` ou similar.
