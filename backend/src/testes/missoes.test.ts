import { listarMissoes, verificarMissoes } from "../controladores/missoes"
import { conectarBancoTeste } from "../utilitarios/conexaoBD"
import { deletarDadosTeste } from "../utilitarios/deletarDadosTestes"

describe("Funcionalidade de Listar Missões", () => {
  let idUsuario: number
  let db: any

  beforeAll(async () => {
    db = await conectarBancoTeste()
    await deletarDadosTeste()

    // Cria usuário
    const resultado = await db.run(
      `INSERT INTO Usuario (nome, senha, cpf, moedas) VALUES (?, ?, ?, ?)`,
      ['Teste Listagem', '123456', '00000000001', 0]
    )
    idUsuario = resultado.lastID

    // Cria e associa missões (usando o trigger)
    await db.run(
      `INSERT INTO Missao (nome, descricao, meta, tipo, recompensa) VALUES (?, ?, ?, ?, ?)`,
      ['Missão Listagem 1', 'Descrição 1', 1, 'tarefas', 5]
    )
    
    await db.run(
      `INSERT INTO Missao (nome, descricao, meta, tipo, recompensa) VALUES (?, ?, ?, ?, ?)`,
      ['Missão Listagem 2', 'Descrição 2', 1, 'tarefas', 5]
    )
  })

  afterAll(async () => {
    await db.close()
    await deletarDadosTeste()
  })

  it("deve listar todas as missões de um usuário com sucesso", async () => {
  const missoes = await listarMissoes(idUsuario)
  
    // Verificação mais flexível que funciona com array-like objects
    expect(Array.isArray(missoes)).toBe(true)
    expect(missoes.length).toBe(2)

    // Verificação de estrutura
    expect(missoes[0]).toEqual(expect.objectContaining({
      idMissao: expect.any(Number),
      nome: expect.any(String),
      descricao: expect.any(String),
      meta: expect.any(Number),
      statusMissao: expect.stringMatching(/pendente|concluida/)
    }))
  })
})

describe("verificarMissoes", () => {
  let idUsuario: number | undefined

  beforeAll(async () => {
    const db = await conectarBancoTeste()
    await deletarDadosTeste()

    // Cria um usuário de teste
    const result = await db.run(`
      INSERT INTO Usuario (nome, email, cpf, senha, moedas, diasSeguidos)
      VALUES ('Teste Missao', 'teste@missao.com', '12540006478', 'abc123', 0, 10)
    `)
    idUsuario = result.lastID

    // Cria uma missão com recompensa de moedas
await db.run(`
      INSERT INTO Missao (nome, descricao, meta, tipo, recompensa)
      VALUES ('Concluir 1 tarefa', 'Conclua 2 tarefa para ganhar moedas', 2, 'tarefas', 5)
    `)

    await db.run(`
      INSERT INTO Item (tipo, preco, nome) VALUES ('item', 100, 'Chapéu Legal')
    `)
    const idItem = (await db.get(`SELECT last_insert_rowid() as id`)).id

    await db.run(`
      INSERT INTO Missao (nome, descricao, meta, tipo, recompensa, idRecompensa)
      VALUES ('Concluir 3 tarefa e ganhar item', 'Conclua 1 tarefa e ganhe um item', 3, 'tarefas', 0, ?)
    `, idItem)

    // Verifica associações
    const associacoes = await db.all(
      `SELECT * FROM Missao_Usuario WHERE idUsuario = ?`,
      [idUsuario]
    )
    console.log('Associações de missões:', associacoes)

    // Cria tarefas concluídas (3 para atingir as metas)
    await db.run(`
      INSERT INTO Tarefa (idUsuario, nome, descricao, status)
      VALUES 
      (?, 'Tarefa Teste', 'tarefa teste', 'concluida'),
      (?, 'Tarefa 2', 'desc', 'concluida'),
      (?, 'Tarefa 3', 'desc', 'concluida')
    `, idUsuario, idUsuario, idUsuario)

    await db.close()
  })

  it("deve concluir as missões e dar recompensas", async () => {

    const db = await conectarBancoTeste()

    await verificarMissoes(Number(idUsuario))

    const missoesConcluidas = await db.all(`
      SELECT * FROM Missao_Usuario WHERE idUsuario = ? AND statusMissao = 'concluida'
    `, idUsuario)
    expect(missoesConcluidas.length).toBe(2)

    const usuario = await db.get(`SELECT moedas FROM Usuario WHERE idUsuario = ?`, idUsuario)
    console.log('Missões concluídas:', missoesConcluidas)//para debug
    expect(usuario.moedas).toBe(5)

    const itemRecebido = await db.get(`
      SELECT * FROM Item_Usuario WHERE idUsuario = ?
    `, idUsuario)
    expect(itemRecebido).toBeDefined()

    const notificacoes = await db.all(`
      SELECT * FROM Notificacao WHERE idUsuario = ?
    `, idUsuario)
    expect(notificacoes.length).toBe(2)

    await db.close()
  })

  afterAll(async () => {

    await deletarDadosTeste()
  })
})