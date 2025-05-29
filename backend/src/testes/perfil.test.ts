import { editarPerfil, exibirPerfil } from '../controladores/perfil'
import bcrypt from 'bcrypt'
import { conectarBancoTeste } from '../utilitarios/conexaoBD'
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'

describe('Funcionalidade de Exibir Perfil', () => {
  let idUsuario: number

  beforeAll(async () => {
    const db = await conectarBancoTeste()
    await deletarDadosTeste()

    // Cria o usuário de teste
    const resultado = await db.run(`
        INSERT INTO Usuario (nome, senha, cpf, moedas, avatar, corAvatar, email)
        VALUES ('Teste', '1234', '00000000753', 0, 'coroa', '#ffcc00', 'teste45@example.com')
    `)
    idUsuario = resultado.lastID!

    // Cria 5 missões
    for (let i = 1; i <= 5; i++) {
      const missao = await db.run(`
        INSERT INTO Missao (nome, descricao, meta, tipo, recompensa) VALUES (?, ?, ?, ?, ?)`,
        [`Missão ${i}`, `Descrição ${i}`, 1, 'tarefas', 5]
      )

      await db.run(`
        UPDATE Missao_Usuario 
        SET statusMissao = 'concluida'
        WHERE idMissao = ? AND idUsuario = ?`,
        [missao.lastID, idUsuario]
      )

      // Criar uma recompensa tipo Badge para cada missão
      const recompensa = await db.run(`
        INSERT INTO Recompensa (origem) VALUES ('Missão')`
      )

      await db.run(`
      INSERT INTO Usuario_Recompensa (idRecompensa, idUsuario, tipoRecompensa)
      VALUES (?, ?, ?)`,
      [recompensa.lastID, idUsuario, 'Badge']
      )
    }
    await db.close()
  })

  afterAll(async () => {

    await deletarDadosTeste()
  })

  it('deve exibir corretamente o perfil do usuário', async () => {
    const perfil = await exibirPerfil(idUsuario)

    expect(perfil).toBeDefined()
    expect(perfil.nome).toBe('Teste')
    expect(perfil.email).toBe('teste45@example.com')
    expect(perfil.avatar).toBe('coroa')
    expect(perfil.corAvatar).toBe('#ffcc00')
    expect(perfil.progresso.concluidas).toBe(5)
    expect(perfil.badges).toBeDefined()
    expect(Array.isArray(perfil.badges)).toBe(true)
    expect(perfil.badges.length).toBeGreaterThanOrEqual(1)
    expect(perfil.badges[0]).toHaveProperty('idRecompensa')
    expect(perfil.badges[0]).toHaveProperty('origem', 'Missão')
  })
})

describe('Funcionalidade de Editar Perfil', () => {
  let db: any
  let userId: number

  beforeEach(async () =>{

    //abrindo o banco de dados
    db = await conectarBancoTeste()
    deletarDadosTeste()

    // Cria usuário com senha "teste9"
    const senhaHash = await bcrypt.hash('teste9', 10)
    const result = await db.run(`
      INSERT INTO Usuario (nome, email, senha, cpf, moedas, telefone)
      VALUES (?, ?, ?, ?, ?, ?)`,
      ['Usuário Teste', 'teste@teste.com', senhaHash, '12345678900', 0, '81999999999']
    )
    userId = result.lastID
  })

  afterAll(async () => {
    deletarDadosTeste()
  })

  it('Deve atualizar nome e telefone com sucesso', async() => {
    const resultado = await editarPerfil(userId, {
      nome: 'Novo nome',
      telefone: '81988888888'
    })

    expect(resultado).toBe('Perfil atualizado com sucesso!')

    db = await conectarBancoTeste()
    const usuario = await db.get(`SELECT nome, telefone FROM Usuario WHERE idUsuario = ?`, userId)
    await db.close()

    expect(usuario.nome).toBe('Novo nome')
    expect(usuario.telefone).toBe('81988888888')
  })

  it('Deve atualizar email com confirmação de senha correta', async () => {
    const resultado = await editarPerfil(userId, {
        email: 'novoemail@teste.com',
        senhaAtual: 'teste9'
    })

    expect(resultado).toBe('Perfil atualizado com sucesso!')

    const usuarioAtualizado = await db.get(
        `SELECT email FROM Usuario WHERE idUsuario = ?`, 
        userId
    )
    expect(usuarioAtualizado.email).toBe('novoemail@teste.com')
  })

  it('Deve falhar ao tentar atualizar senha com formato inválido', async () => {
    await expect(
      editarPerfil(userId, {
        novaSenha: '123',
        senhaAtual: 'teste9'
      })
    ).rejects.toThrow('A nova senha deve ser alfanumérica e conter exatamente 6 caracteres.')
  })

  it('Deve atualizar a senha com sucesso', async () => {
    const resultado = await editarPerfil(userId, {
      novaSenha: 'abc123',
      senhaAtual: 'teste9'
    })

    expect(resultado).toBe('Perfil atualizado com sucesso!')

    db = await conectarBancoTeste()

    const usuario = await db.get(`SELECT senha FROM Usuario WHERE idUsuario = ?`, userId)
    await db.close()

    const senhaConfere = await bcrypt.compare('abc123', usuario.senha)
    expect(senhaConfere).toBe(true)
  })
})