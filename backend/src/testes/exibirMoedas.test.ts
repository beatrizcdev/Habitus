import { pegarMoedasUsuario } from '../controladores/exibirMoedas' 
import { conectarBancoTeste } from '../utilitarios/conexaoBD'
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'

describe('Funcionalidade de Moedas do Usuário', () => {
  let idUsuario: number| undefined

  beforeAll(async () => {
    const db = await conectarBancoTeste()
    //deleta dados do banco para impedir conflitos
    await deletarDadosTeste()

    // Cria um usuário de teste com 50 moedas
    const resultado = await db.run(`
      INSERT INTO Usuario (nome, senha, cpf, moedas)
      VALUES (?, ?, ?, ?)
    `, ['MoedaTeste', 'senha123', '99999999999', 50])

    idUsuario = resultado.lastID
    await db.close()
  })

  afterAll(async () =>{
    await deletarDadosTeste()
  })

  it('deve retornar a quantidade correta de moedas do usuário', async () => {
    const moedas = await pegarMoedasUsuario(Number(idUsuario))
    expect(moedas).toBe(50)
  })

  it('deve lançar erro se o usuário não existir', async () => {
    await expect(pegarMoedasUsuario(999999)).rejects.toThrow('Usuário não encontrado')
  })
})
