import { verificarPrimeiroAcesso } from "../controladores/tutorial"
import { conectarBancoTeste } from "../utilitarios/conexaoBD"
import { deletarDadosTeste } from "../utilitarios/deletarDadosTestes"

describe("verificarPrimeiroAcesso", () => {
  let userId: number

  beforeEach(async () => {
    const db = await conectarBancoTeste()
    await deletarDadosTeste()

    // Limpa e insere um usuário sem primeiroAcesso
    const result = await db.run(`
      INSERT INTO Usuario (nome, senha, cpf, moedas)
      VALUES ('Teste', 'abc123', '00000000010', 0)
    `)

    userId = result.lastID!
    await db.close()
  })

  afterAll(async () => {
    await deletarDadosTeste()
  })

  it("deve retornar true se o campo primeiroAcesso estiver vazio", async () => {
    const resultado = await verificarPrimeiroAcesso(userId)
    expect(resultado).toBe(true)
  })

  it("deve retornar false se o campo primeiroAcesso já estiver preenchido", async () => {
    const db = await conectarBancoTeste()

    await db.run(`
      UPDATE Usuario SET primeiroAcesso = '2025-05-16' WHERE idUsuario = ?
    `, [userId])

    await db.close()

    const resultado = await verificarPrimeiroAcesso(userId)
    expect(resultado).toBe(false)
  })
})
