import {
  adicionarHabito,
  editarHabito,
  excluirHabito,
  marcarHabitoComoConcluido,
  resetarHabitosDiarios,
} from '../controladores/habitos'
import Habito from '../modelos/habitos'
import { conectarBancoTeste } from '../utilitarios/conexaoBD'
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'

describe('Funcionalidades de Hábitos', () => {
  let idUsuario: number | undefined
  let idHabito: number

  beforeAll(async () => {
    const db = await conectarBancoTeste()

    //deleta dados do banco para impedir conflitos
    await deletarDadosTeste()

    // Cria um usuário de teste
    const resultado = await db.run(`INSERT INTO Usuario (nome, senha, cpf, moedas)
      VALUES ('TesteHabitos', '1234', '00000000051', 0)`)
    idUsuario = resultado.lastID

    await db.close()
  })

  afterAll(async () => {
    await deletarDadosTeste()
  })

  it('deve adicionar um hábito com sucesso', async () => {

    if (!idUsuario) throw new Error('idUsuario não definido')

    const habito: Habito = {
      idUsuario,
      nome: 'Hábito Teste',
      status: 'pendente',
      descricao: 'Descrição do hábito de teste',
    }

    const mensagem = await adicionarHabito(habito)
    expect(mensagem).toBe('Habito adicionado com sucesso!')

    // recupera o id do hábito inserido
    const db = await conectarBancoTeste()
    const habitoInserido = await db.get(`SELECT * FROM Habito WHERE nome = ?`, 'Hábito Teste')
    idHabito = habitoInserido.idHabito
    await db.close()
  })

  it('deve editar um hábito com sucesso', async () => {
    const mensagem = await editarHabito(idHabito, {
      nome: 'Hábito Editado',
      status: 'pendente',
      descricao: 'Descrição editada',
    })

    expect(mensagem).toBe('Habito editado com sucesso!')
  })

  it('deve resetar os hábitos diários', async () => {
    await resetarHabitosDiarios()

    const db = await conectarBancoTeste()
    const habito = await db.get(`SELECT status FROM Habito WHERE idHabito = ?`, idHabito)
    expect(habito.status).toBe('pendente')
    await db.close()
  })

  it('deve excluir um hábito com sucesso', async () => {
    const mensagem = await excluirHabito(idHabito)
    expect(mensagem).toBe('Habito excluído com sucesso.')
  })
})

describe('Marcar tarefa como concluída', () => {
    it('Deve atualizar o status da tarefa e adicionar uma moeda ao usuário', async () => {
        const db = await conectarBancoTeste()

        // Inserir um usuário e uma tarefa de teste
        const resultUser = await db.run(`
        INSERT INTO Usuario (nome, senha, cpf, moedas)
        VALUES ('Teste', '1234', '00000000007', 0)
        `)
        const userId = resultUser.lastID!

        const resultHabito = await db.run(`
        INSERT INTO Habito (descricao, status, nome, idUsuario)
        VALUES ('Habito teste', 'pendente', 'nome do habito', ?)
        `, [userId])
        const habitoId = resultHabito.lastID!

        await db.close()

        // Chama a função
        await marcarHabitoComoConcluido(habitoId)

        const db2 = await conectarBancoTeste()

        const habitoAtualizado = await db2.get('SELECT status FROM Habito WHERE idHabito = ?', habitoId)
        const usuarioAtualizado = await db2.get('SELECT moedas FROM Usuario WHERE idUsuario = ?', userId)

        expect(habitoAtualizado.status).toBe('concluido')
        expect(usuarioAtualizado.moedas).toBe(1)

        await db2.close()
    })
})
