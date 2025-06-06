# Habitus

## Sobre o Projeto

**Habitus** é uma solução inovadora desenvolvida em parceria com o **Banco do Brasil**, através da **Residência OnBoard do Porto Digital** combinando gestão de tarefas com elementos de gamificação e educação financeira. 

### Objetivo Principal
Desenvolver uma plataforma web que:
- Transforme a produtividade em uma experiência engajadora através de mecânicas de jogos
- Reduza significativamente os índices de procrastinação
- Integre gestão de tarefas com planejamento financeiro pessoal

### Destaques
- **Gamificação**: Sistema de recompensas através de loja, níveis e conquistas
- **Dashboard Interativo**: Visualização clara do progresso diário/semanal

---

## 1. Links Úteis

- **Código-fonte (GitHub):** https://github.com/beatrizcdev/Habitus  
- **Deploy (produção):** *pendente*  
- **Download do ZIP:** *pendente*

---

## 2. Pré-requisitos

- **Node.js** v16+  
- **npm** ou **yarn**  
- **SQLite3** (caso queira modificar o banco de dados, pois o **app.db** já é incluído)
- **liveServer**

---

## 3. Rodando o projeto

### 3.1. Configuração do Backend


**3.1.1. Entre na pasta do backend:**
   ```
   cd backend
   ```
**3.1.2. Instale dependências:**  
   ```
   npm install
   ```
**3.1.3. Variáveis de ambiente:**  
- Estarão na `.env`  
  ```
  PORT=5000
  ```
**3.1.4. (Opcional) Criar banco do zero:**  
   ```
   sqlite3 backend/app.db < backend/estrutura_banco.sql
   ```

   - rodar as migrations
   ```
   npm run knex:migrate
   ```
   - popular o banco de dados
   ```
   npm run knex:seed
   ```
**3.1.5. Inicie em modo dev:**  
   ```
   npm run dev
   ```
   - API estará em `http://localhost:5000`

---

## 3.2. Configuração do Frontend

Existem duas opções para servir o HTML/CSS/JS static:

### 3.2.1. Via Live Server (VSCode)

- Abra a pasta `frontend` no VSCode  
- Clique com o botão direito em `index.html` → “Open with Live Server”  
- Será aberto em `http://127.0.0.1:5500`

### 3.2.2. Via pacote HTTP simples

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

---

## 4. Documentação das Rotas do Backend

<details>
  <summary>
    <b>Clique aqui para ver todas as rotas do backend</b>
  </summary>

  <details>
    <summary>
      <strong>POST</strong> <code>/cadastrar</code> — Cadastrar novo usuário
    </summary>

    **Descrição:**  
    Cria um novo usuário no sistema.

    **Body esperado:**
    ```json
    {
      "nome": "Nome do usuário",
      "email": "email@exemplo.com",
      "cpf": "12345678900",
      "senha": "senha123"
    }
    ```

    **Resposta:**
    ```json
    {
      "sucesso": true,
      "mensagem": "Usuário cadastrado com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>POST</strong> <code>/login</code> — Login do usuário
    </summary>

    **Descrição:**  
    Realiza o login do usuário pelo e-mail ou CPF e senha.

    **Body esperado:**
    ```json
    {
      "emailOuCpf": "email@exemplo.com",
      "senha": "senha123"
    }
    ```

    **Resposta:**
    ```json
    {
      "message": "Login realizado com sucesso",
      "userId": 1
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/usuario/primeiro-acesso/:id</code> — Verificar primeiro acesso
    </summary>

    **Descrição:**  
    Verifica se o usuário está acessando pela primeira vez.

    **Parâmetros:**
    - <code>:id</code> (number) — ID do usuário

    **Resposta:**
    ```json
    {
      "primeiroAcesso": true
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/tarefas/:idUsuario</code> — Listar tarefas do usuário
    </summary>

    **Descrição:**  
    Retorna todas as tarefas cadastradas para o usuário informado.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**
    ```json
    [
      {
        "idTarefa": 1,
        "nome": "Estudar Node.js",
        "descricao": "Ler documentação oficial",
        "prioridade": "alta",
        "categoria": "Estudo",
        "dataLimite": "2024-06-10",
        "status": "pendente"
      }
    ]
    ```

  </details>

  <details>
    <summary>
      <strong>POST</strong> <code>/tarefas/:idUsuario/adicionar</code> — Adicionar nova tarefa
    </summary>

    **Descrição:**  
    Adiciona uma nova tarefa para o usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Body esperado:**
    ```json
    {
      "nome": "Nome da tarefa",
      "descricao": "Descrição",
      "prioridade": "alta|media|baixa",
      "categoria": "Categoria",
      "dataLimite": "YYYY-MM-DD"
    }
    ```

    **Resposta:**
    ```json
    {
      "success": true,
      "message": "Tarefa adicionada com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>PUT</strong> <code>/editarTarefa/:id</code> — Editar tarefa
    </summary>

    **Descrição:**  
    Edita os dados de uma tarefa existente.

    **Parâmetros:**
    - <code>:id</code> (number) — ID da tarefa

    **Body esperado:**
    ```json
    {
      "nome": "Novo nome",
      "descricao": "Nova descrição",
      "dataLimite": "YYYY-MM-DD",
      "prioridade": "alta|media|baixa",
      "categoria": "Categoria"
    }
    ```

    **Resposta:**
    ```json
    {
      "mensagem": "Tarefa editada com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>PUT</strong> <code>/tarefa/:id/concluir</code> — Marcar tarefa como concluída
    </summary>

    **Descrição:**  
    Marca uma tarefa como concluída ou pendente.

    **Parâmetros:**
    - <code>:id</code> (number) — ID da tarefa

    **Resposta:**
    ```json
    {
      "mensagem": "Tarefa marcada como concluída",
      "status": "concluida"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>DELETE</strong> <code>/tarefas/:id</code> — Excluir tarefa
    </summary>

    **Descrição:**  
    Exclui uma tarefa pelo ID.

    **Parâmetros:**
    - <code>:id</code> (number) — ID da tarefa

    **Resposta:**
    ```json
    {
      "mensagem": "Tarefa excluída com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/missoes/:idUsuario</code> — Listar missões do usuário
    </summary>

    **Descrição:**  
    Retorna todas as missões do usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**  
    Array de missões.
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/perfil/:idUsuario</code> — Exibir perfil do usuário
    </summary>

    **Descrição:**  
    Retorna os dados do perfil do usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**  
    Objeto com dados do perfil.
  </details>

  <details>
    <summary>
      <strong>PUT</strong> <code>/:idUsuario</code> — Editar perfil do usuário
    </summary>

    **Descrição:**  
    Edita os dados do perfil do usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Body esperado:**  
    Campos a serem atualizados.

    **Resposta:**  
    ```json
    {
      "mensagem": "Perfil atualizado com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/moedas/:idUsuario</code> — Exibir moedas do usuário
    </summary>

    **Descrição:**  
    Retorna a quantidade de moedas do usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**  
    ```json
    {
      "moedas": 100
    }
    ```
  </details>

  <details>
    <summary>
      <strong>POST</strong> <code>/habitos/:idUsuario/adicionar</code> — Adicionar novo hábito
    </summary>

    **Descrição:**  
    Adiciona um novo hábito para o usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Body esperado:**
    ```json
    {
      "nome": "Nome do hábito",
      "descricao": "Descrição"
    }
    ```

    **Resposta:**
    ```json
    {
      "sucesso": true,
      "mensagem": "Hábito adicionado com sucesso",
      "idUsuario": 1
    }
    ```
  </details>

  <details>
    <summary>
      <strong>PUT</strong> <code>/habitos/:idHabito</code> — Editar hábito
    </summary>

    **Descrição:**  
    Edita os dados de um hábito existente.

    **Parâmetros:**
    - <code>:idHabito</code> (number) — ID do hábito

    **Body esperado:**
    ```json
    {
      "nome": "Novo nome",
      "descricao": "Nova descrição"
    }
    ```

    **Resposta:**
    ```json
    {
      "mensagem": "Hábito editado com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>DELETE</strong> <code>/habitos/:idHabito</code> — Excluir hábito
    </summary>

    **Descrição:**  
    Exclui um hábito pelo ID.

    **Parâmetros:**
    - <code>:idHabito</code> (number) — ID do hábito

    **Resposta:**
    ```json
    {
      "mensagem": "Hábito excluído com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>PUT</strong> <code>/habitos/:idHabito/concluir</code> — Marcar hábito como concluído
    </summary>

    **Descrição:**  
    Marca ou desmarca um hábito como concluído.

    **Parâmetros:**
    - <code>:idHabito</code> (number) — ID do hábito

    **Resposta:**
    ```json
    {
      "mensagem": "Hábito marcado como concluído",
      "status": "concluido"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/habitos/:idUsuario</code> — Listar hábitos do usuário
    </summary>

    **Descrição:**  
    Retorna todos os hábitos cadastrados para o usuário informado.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**
    ```json
    [
      {
        "idHabito": 1,
        "nome": "Beber água",
        "descricao": "Tomar 2L por dia",
        "status": "pendente"
      }
    ]
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/loja/itens</code> — Listar itens da loja
    </summary>

    **Descrição:**  
    Retorna todos os itens disponíveis na loja.

    **Resposta:**  
    Array de itens.
  </details>

  <details>
    <summary>
      <strong>POST</strong> <code>/loja/comprar</code> — Comprar item na loja
    </summary>

    **Descrição:**  
    Realiza a compra de um item na loja.

    **Body esperado:**
    ```json
    {
      "idUsuario": 1,
      "idItem": 2
    }
    ```

    **Resposta:**
    ```json
    {
      "mensagem": "Compra realizada com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/inventario</code> — Listar inventário do usuário autenticado
    </summary>

    **Descrição:**  
    Retorna todos os itens do inventário do usuário autenticado.

    **Resposta:**  
    Array de itens.
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/inventario/:idUsuario</code> — Listar inventário de qualquer usuário
    </summary>

    **Descrição:**  
    Retorna todos os itens do inventário do usuário informado.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**  
    Array de itens.
  </details>

  <details>
    <summary>
      <strong>PATCH</strong> <code>/inventario/:idItem/equipar</code> — Equipar item do inventário
    </summary>

    **Descrição:**  
    Equipa um item do inventário para o usuário.

    **Parâmetros:**
    - <code>:idItem</code> (number) — ID do item

    **Body esperado:**
    ```json
    {
      "idUsuario": 1
    }
    ```

    **Resposta:**
    ```json
    {
      "mensagem": "Item equipado com sucesso"
    }
    ```
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/usuario/:id</code> — Obter usuário por ID
    </summary>

    **Descrição:**  
    Retorna os dados do usuário pelo ID.

    **Parâmetros:**
    - <code>:id</code> (number) — ID do usuário

    **Resposta:**  
    Objeto com dados do usuário.
  </details>

  <details>
    <summary>
      <strong>GET</strong> <code>/notificacoes/:idUsuario</code> — Listar notificações do usuário
    </summary>

    **Descrição:**  
    Retorna todas as notificações do usuário.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**  
    Array de notificações.
  </details>

  <details>
    <summary>
      <strong>PUT</strong> <code>/notificacoes/:idUsuario/ler</code> — Marcar notificações como lidas
    </summary>

    **Descrição:**  
    Marca todas as notificações do usuário como lidas.

    **Parâmetros:**
    - <code>:idUsuario</code> (number) — ID do usuário

    **Resposta:**
    ```json
    {
      "mensagem": "Notificações marcadas como lidas."
    }
    ```
  </details>
</details>

---
## 5. Documentação do Frontend

O frontend do Habitus é composto por páginas HTML, estilos CSS, scripts de integração com o backend e ativos gráficos (SVGs). A estrutura de pastas foi pensada para facilitar a manutenção, a escalabilidade e o entendimento dos diferentes módulos do projeto.

---

### Estrutura das Pastas do Frontend

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
  Página de boas vindas.

- **styles.css**  
  Estilo global adicional (caso necessário).

---

Cada pasta e arquivo foi pensado para separar responsabilidades, facilitar a colaboração e tornar o desenvolvimento e manutenção do projeto mais ágil e organizado.
