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

# 🌐 Frontend

O frontend do Habitus é composto por páginas HTML, estilos CSS, scripts de integração com o backend e ativos gráficos (SVGs). A estrutura de pastas foi pensada para facilitar a manutenção, a escalabilidade e o entendimento dos diferentes módulos do projeto.

---

## Estrutura das Pastas do Frontend

```text
frontend/
├── integracao/       # Scripts JS para integração com o backend (um por funcionalidade)
├── pages/            # Páginas HTML (views) do sistema
├── pictures/         # Imagens, ícones e SVGs usados na interface
├── script/           # Scripts auxiliares e de interface
├── style/            # Arquivos CSS organizados por página/componente
├── index.html        # Página inicial
└── styles.css        # Estilo global (separado do /style)
```

### O que faz cada pasta/arquivo?

- **integracao/**  
  Scripts JavaScript responsáveis por consumir as APIs do backend e integrar os dados às páginas.  
  Cada arquivo corresponde a uma funcionalidade principal do sistema:
  - `avatar.js`: Gerencia o avatar do usuário (obter, atualizar, equipar skins).
  - `cadastro.js`: Fluxo de registro de novos usuários.
  - `dashboard.js`: Exibe dados gerais e progresso do usuário.
  - `editar-perfil.js`: Permite editar informações do perfil.
  - `habitos.js`: Gerencia hábitos (CRUD, conclusão, integração com backend).
  - `login.js`: Autenticação de usuários.
  - `loja.js`: Consome endpoints da loja para compra de itens virtuais.
  - `missoes.js`: Busca e atualiza o estado das missões do usuário.
  - `moedas.js`: Gerencia moedas e recursos virtuais.
  - `notificacoes.js`: Busca e exibe notificações do usuário.
  - `tarefas.js`: Controla tarefas diárias (CRUD, conclusão, exclusão).
  - `tutorial.js`: Gerencia o tutorial inicial e onboarding.

- **pages/**  
  Páginas HTML do sistema, cada uma representando uma view ou funcionalidade:
  - `dashboard.html`: Painel principal do usuário.
  - `cadastro.html`, `login.html`: Telas de autenticação.
  - `avatar.html`, `editar-perfil.html`: Gerenciamento de perfil e avatar.
  - `equipe.html`, `missoes.html`, `loja.html`, `suporte.html`: Outras funcionalidades.
  - `utilitarios/navbar.html`: Componente HTML reutilizável da navbar.

- **style/**  
  Arquivos CSS organizados por página ou componente:
  - `global.css`: Estilos globais, variáveis e resets.
  - `navbar.css`, `dashboard.css`, `tarefas.css`, `habitos.css`, etc.: Estilos específicos para cada parte da aplicação.

- **pictures/**  
  Imagens, ícones, SVGs e badges utilizados na interface, organizados em subpastas por tipo (ex: `arvore/`, `badges/`).

- **script/**  
  Scripts auxiliares para funcionalidades de interface e componentes reutilizáveis.

- **index.html**  
  Página inicial do frontend.

- **styles.css**  
  Estilo global adicional (caso necessário).

---

Cada pasta e arquivo foi pensado para separar responsabilidades, facilitar a colaboração e tornar o desenvolvimento e manutenção do projeto mais ágil e organizado.