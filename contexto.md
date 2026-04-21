# Contexto do Projeto: Delícias da Cris

Este projeto é uma **aplicação interativa de cardápio digital** para a "Delícias da Cris". Evoluído de uma landing page estática para um sistema de pedidos dinâmico, o objetivo é permitir que clientes montem seu pedido diretamente na interface e o enviem formatado via WhatsApp.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e SEO.
- **CSS3 (Vanilla)**: Design premium com variáveis CSS, animações modernas, Flexbox e Grid.
- **JavaScript (ES Modules)**: Arquitetura modular separando lógica de dados, carrinho e interface.
- **Web Storage API**: Uso de `localStorage` para persistência do carrinho entre sessões.
- **Aesthetics**: Design limpo e "apetitoso", focado em UX mobile-first com paleta de cores coral, creme e marrom.

## 📂 Estrutura de Pastas

```text
/
├── assets/
│   ├── images/
│   │   └── logo.png        # Logo oficial da marca
│   ├── scripts/
│   │   ├── utils/
│   │   │   └── dom.js      # Utilitários de manipulação do DOM
│   │   ├── cart.js         # Lógica de negócio do carrinho de compras
│   │   ├── menu.js         # Base de dados (JSON) do cardápio
│   │   ├── ui.js           # Gerenciamento de renderização e eventos da UI
│   │   ├── whatsapp.js     # Formatador de mensagens para WhatsApp
│   │   └── main.js         # Script principal (entry point e bootstrap)
│   └── styles/
│       └── main.css        # Estilização global e componentes dinâmicos
├── index.html              # Interface única do cardápio/app
└── contexto.md             # Este documento de contexto
```

## 🚀 Funcionalidades Principais

1.  **Cardápio Dinâmico com Abas**: Categorização (Salgados, Tortas, Bolos, Pães) com navegação rápida e suave.
2.  **Sistema de Carrinho Interativo**: Adição/remoção de itens com controle de quantidade em tempo real.
3.  **Persistência de Dados**: O carrinho é mantido salvo localmente, permitindo que o usuário não perca sua seleção ao fechar ou atualizar a página.
4.  **Checkout via WhatsApp**: Geração automática de uma mensagem profissional e organizada contendo a lista de itens, quantidades e valor total.
5.  **Responsividade Mobile-First**: Interface otimizada para smartphones com botões de fácil alcance e navegação intuitiva.
6.  **Acessibilidade & UX**: Feedbacks visuais ao adicionar itens, contadores dinâmicos e hierarquia visual clara.

## 🎨 Guia de Estilo (Design Tokens)

- **Primária**: `#ff887d` (Coral)
- **Secundária**: `#45271d` (Marrom Café)
- **Fundo**: `#fffdf8` (Creme suave)
- **Acento**: `#ffe1de` (Rosa claro)

## 📌 Status Atual

A aplicação está na versão **2.0 (Interativa)**. O cardápio é renderizado dinamicamente via JavaScript, facilitando a atualização de preços e itens apenas modificando o arquivo `menu.js`. O fluxo de pedido está completo e testado.
