<h1 style="font-size:48px;width:100%;text-align:center;font-weight:bold;background-image:linear-gradient(0deg,rgba(20, 97, 82, 1) 0%, rgba(143, 209, 123, 1) 100%);color: transparent;background-clip: text;">Habitus</h1>

## Sobre o Projeto

**Habitus** é uma solução inovadora desenvolvida em parceria com o **Banco do Brasil**, através da Residência OnBoard do **Porto Digital** combinando gestão de tarefas com elementos de gamificação e educação financeira. 

### Objetivo Principal
Desenvolver uma plataforma web que:
- Transforme a produtividade em uma experiência engajadora através de mecânicas de jogos
- Reduza significativamente os índices de procrastinação
- Integre gestão de tarefas com planejamento financeiro pessoal

### Destaques
- **Gamificação**: Sistema de recompensas, níveis e conquistas
- **Dashboard Interativo**: Visualização clara do progresso diário/semanal

---

## 1. Links Úteis

- **Código-fonte (GitHub):** https://github.com/beatrizcdev/planoB  
- **Deploy (produção):** *pendente*  
- **Download do ZIP:** *pendente*

---

## 2. Pré-requisitos

- **Node.js** v16+  
- **npm** ou **yarn**  
- **SQLite3** (caso queira modificar o banco de dados, pois o **app.db** já é incluído)

---

## 3. Estrutura do Projeto

```
/
├── backend/
│   ├── src/
│   ├── .env.example            < pendente
│   ├── app.db                  ← banco já populado
│   ├── estrutura_banco.sql     ← script de criação (opcional)
│   └── package.json
├── frontend/
│   ├── integracao
│   ├── pages
│   ├── pictures
│   ├── script
│   ├── style
│   ├── index.html
│   └── styles.css
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 4. Rodando o projeto

### 4.1. Configuração do Backend


**4.1.1. Entre na pasta do backend:**
   ```
   cd backend
   ```
**4.1.2. Instale dependências:**  
   ```
   npm install
   ```
**4.1.3. Variáveis de ambiente:**  
- Duplique `.env.example` para `.env`  
  ```
  PORT=5000
  ```
**4.1.4. (Opcional) Criar banco do zero:**  
   ```
   sqlite3 app.db < schema.sql
   ```
**4.1.5. Inicie em modo dev:**  
   ```
   npm run dev
   ```
   - API estará em `http://localhost:5000`

---

## 4.2. Configuração do Frontend

Existem duas opções para servir o HTML/CSS/JS static:

### 5.1 Via Live Server (VSCode)

- Abra a pasta `frontend` no VSCode  
- Clique com o botão direito em `index.html` → “Open with Live Server”  
- Será aberto em `http://127.0.0.1:5500`

### 5.2 Via pacote HTTP simples

1. Instale globalmente (se preferir):  
   ```bash
   npm install -g http-server
   ```
2. Sirva a pasta:  
   ```bash
   cd frontend
   http-server -p 5500
   ```
3. Acesse `http://localhost:5500`

Após isso o frontend já irá consumir automaticamente a api do backend, e a aplicação estará pronta para uso e desenvolvimento.

# 🌐 Projeto Frontend

Descrição breve do projeto:  
Este repositório contém a camada frontend de uma aplicação web, com páginas HTML, estilos CSS, scripts de integração com o backend e ativos gráficos (SVGs). A estrutura de pastas está organizada para facilitar a manutenção e o entendimento dos diferentes módulos.

---

## 📋 Sumário

- [📂 Estrutura de Pastas](#estrutura-de-pastas)  
  - [Integração](#integração)  
  - [Páginas (Pages)](#páginas-pages)  
  - [Estilos (Style)](#estilos-style)  
  - [Scripts (Script)](#scripts-script)  
  - [Imagens (Pictures)](#imagens-pictures)  
  - [Arquivo Principal (Root)](#arquivo-principal-root)  
- [🚀 Como Executar Localmente](#como-executar-localmente)  
- [🧩 Fluxo de Integração (Integração)](#fluxo-de-integração-integração)  
- [🔧 Tecnologias e Ferramentas](#tecnologias-e-ferramentas)  
- [📄 Licença](#licença)

---

## Estrutura de Pastas

```text
/
├── README.md
└── frontend/
    ├── integracao/       # Pasta dedicada contendo os scripts de integração entre backend e frontend, composta pelas seguintes pastas.
    │   ├── avatar.js
    │   ├── cadastro.js
    │   ├── dashboard.js
    │   ├── editar-perfil.js
    │   ├── habitos.js
    │   ├── login.js
    │   ├── loja.js
    │   ├── missoes.js
    │   ├── moedas.js
    │   ├── notificacoes.js
    │   ├── tarefas.js
    │   └── tutorial.js
    │
    ├── pages/            # Páginas estáticas (HTML)
    │   ├── avatar.html
    │   ├── cadastro.html
    │   ├── dashboard.html
    │   ├── editar-perfil.html
    │   ├── equipe.html
    │   ├── login.html
    │   ├── loja.html
    │   ├── missoes.html
    │   ├── suporte.html
    │   └── utilitarios/
    │       └── navbar.html
    │
    ├── style/            # Arquivos de estilo (CSS)
    │   ├── avatar.css
    │   ├── cadastro.css
    │   ├── editar-perfil.css
    │   ├── equipe.css
    │   ├── global.css
    │   ├── habitos.css
    │   ├── login.css
    │   ├── loja.css
    │   ├── missoes.css
    │   ├── navbar.css
    │   ├── suporte.css
    │   └── tarefas.css
    │
    ├── pictures/         # Ativos gráficos (SVG, ícones, badges, etc.)
    │   ├── arvore/
    │   │   ├── arvore.svg
    │   │   ├── arvore-ajuda.svg
    │   │   ├── arvore-inicio.svg
    │   │   └── arvore-niveis/
    │   │       ├── arvore-fase-1.svg
    │   │       ├── arvore-fase-2.svg
    │   │       ├── arvore-fase-3.svg
    │   │       ├── arvore-fase-4.svg
    │   │       ├── arvore-fase-5.svg
    │   │       └── arvore-fase-6.svg
    │   └── badges/
    │       ├── badge1.svg
    │       ├── badge2.svg
    │       ├── badge3.svg
    │       ├── lixeira.svg
    │       ├── missions.svg
    │       └── [outros arquivos SVG…]
    │
    ├── script/           # Scripts auxiliares (JS)
    │   ├── dashboard.js
    │   ├── loja.js
    │   └── navbar.js
    │
    ├── index.html        # Página inicial (entry point)
    └── style.css         # Estilo global (separado do /style)

## Fluxo de Integração (Integração)
A pasta integracao/ contém todos os scripts JS responsáveis por fazer chamadas ao backend e integrar os dados com as funcionalidades do frontend. Cada arquivo de integracao/*.js corresponde a uma “feature” ou módulo que consome endpoints específicos:

   avatar.js

      - Faz requisições para obter, atualizar e gerenciar o avatar do usuário.

   cadastro.js

      - Responsável pelo fluxo de registro (signup) de novos usuários.

   dashboard.js

      - Obtém e exibe dados gerais da conta no painel principal (dashboard).

   editar-perfil.js

      - Controla a edição de informações do perfil (nome, bio, foto).

   habitos.js

      - Integração para gerenciar hábitos do usuário.

   login.js

      - Lida com o fluxo de login/autenticação.

   loja.js

      - Consome endpoints da “loja” para compra de itens virtuais.

   missoes.js

      - Busca e atualiza estado de missões do usuário.

   moedas.js

      - Gerencia a quantidade de moedas/recursos virtuais do usuário.

   notificacoes.js

      - Busca e exibe as notificações pendentes do usuário.

   tarefas.js

      - Controla interações relacionadas a tarefas diárias.

   tutorial.js

      - Faz o redirecionamento e controle do tutorial inicial da aplicação.

   ## Páginas (Pages)
      A pasta pages/ contém as páginas HTML correspondentes às diferentes “rotas” ou “views” do aplicativo. Cada arquivo HTML normalmente referencia um CSS (na pasta style/) e um script de integração (na pasta integracao/ ou script/).

   avatar.html

      - Exibe e permite ao usuário gerenciar o avatar.

   cadastro.html

      -Formulário de cadastro de novos usuários.

   dashboard.html

      - Página principal após login, exibindo resumo de progresso.

   editar-perfil.html

      - Formulário para o usuário editar dados pessoais.

   equipe.html

      - Lista membros da equipe ou guilda.

   login.html

      - Tela de autenticação do usuário.

   loja.html

      - Página da “loja” de itens virtuais.

   missoes.html

      - Exibe missões disponíveis e completadas.

   suporte.html

      - Página de suporte/ajuda do usuário.

   utilitarios/navbar.html

      - Partial HTML que representa a barra de navegação (navbar) compartilhada por várias páginas.

   #Estilos (Style)
      Na pasta style/ estão os arquivos CSS específicos de cada página ou componente. Há também um global.css que define estilos compartilhados, variáveis e resets.

   - avatar.css

   - cadastro.css

   - editar-perfil.css

   - equipe.css

   - global.css

   - habitos.css

   - login.css

   - loja.css

   - missoes.css

   - navbar.css

   - suporte.css

   - tarefas.css

Cada arquivo de estilo contém regras de layout, tipografia e responsividade para o respectivo componente ou página.