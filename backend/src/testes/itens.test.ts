// tests/comprarItem.test.ts
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'
import { comprarItem, equiparItem, listarInventario } from '../controladores/itens'
import { conectarBancoTeste } from '../utilitarios/conexaoBD'

async function criarUsuarioComMoedas(moedas: number) {
  const db = await conectarBancoTeste ()
  await db.run(`INSERT INTO Usuario (idUsuario, nome, moedas, cpf, senha, avatar, corAvatar, missoesFeitas) 
                VALUES (1, 'Teste', ?, '00000000000', '123456', 'default', '#fff', 0)`, [moedas])
  await db.close()
}

async function criarItem(preco: number) {
  const db = await conectarBancoTeste ()
  await db.run(`INSERT INTO Item (idItem, tipo, preco, nome, descricao) 
                VALUES (1, 'skin', ?, 'Chapéu', 'Item de teste')`, [preco])
  await db.close()
}

beforeEach(async () => {
  await deletarDadosTeste()
})

afterEach(async () => {
    await deletarDadosTeste()
})

describe('Função comprarItem', () => {
  test('deve permitir compra com moedas suficientes', async () => {
    await criarUsuarioComMoedas(100)
    await criarItem(50)

    const mensagem = await comprarItem(1, 1, true)

    expect(mensagem).toBe('Item comprado e equipado com sucesso!')
  })

  it('deve impedir compra com moedas insuficientes', async () => {
    await criarUsuarioComMoedas(10)
    await criarItem(50)

    await expect(comprarItem(1, 1, false))
      .rejects.toThrow('Moedas insuficientes para comprar este item.')
  })

  it('deve lançar erro se o item não existir', async () => {
    await criarUsuarioComMoedas(100)

    await expect(comprarItem(1, 99, false))
      .rejects.toThrow('Item não encontrado.')
  })

  it('deve impedir compra de item já comprado', async () => {
    await criarUsuarioComMoedas(100)
    await criarItem(30)

    await comprarItem(1, 1, false)

    await expect(comprarItem(1, 1, false))
      .rejects.toThrow('Você já possui esse item')
  })
})

describe("Inventário - Funções", () => {
  let db: any
  let idUsuario = 1
  let idItemA = 1
  let idItemB = 2

  beforeEach(async () => {
    db = await conectarBancoTeste()
    await deletarDadosTeste()

    // Cria um usuário
    await db.run(`
      INSERT INTO Usuario (idUsuario, nome, senha, moedas, cpf, avatar, corAvatar, missoesFeitas)
      VALUES (?, 'Fulano', '123456', 100, '12345678900', 'avatar1', 'azul', 0)
    `, [idUsuario])

    // Cria dois itens
    await db.run(`
      INSERT INTO Item (idItem, nome, tipo, preco, descricao)
      VALUES (?, 'Chapéu Azul', 'skin', 10, 'Um chapéu azul legal')
    `, [idItemA])

    await db.run(`
      INSERT INTO Item (idItem, nome, tipo, preco, descricao)
      VALUES (?, 'Capa Vermelha', 'skin', 20, 'Uma capa muito estilosa')
    `, [idItemB])

    // Adiciona os dois itens ao inventário do usuário
    await db.run(`
      INSERT INTO Item_Usuario (idItem, idUsuario, equipado, dataCompra)
      VALUES (?, ?, 'SIM', DATE('now'))
    `, [idItemA, idUsuario])

    await db.run(`
      INSERT INTO Item_Usuario (idItem, idUsuario, equipado, dataCompra)
      VALUES (?, ?, 'NÃO', DATE('now'))
    `, [idItemB, idUsuario])
  })

  afterEach(async () => {
    await deletarDadosTeste()
    await db.close()
  })

  it("deve listar todos os itens do inventário", async () => {
    const inventario = await listarInventario(idUsuario)

    expect(inventario).toHaveLength(2)
    expect(inventario[0]).toHaveProperty("nome")
    expect(inventario[0]).toHaveProperty("equipado")
  })

  it("deve equipar o item correto e desequipar os outros", async () => {
    await equiparItem(idUsuario, idItemB)

    const resultado = await db.all(`
      SELECT * FROM Item_Usuario WHERE idUsuario = ?
    `, [idUsuario])

    const equipado = resultado.find((item: any) => item.equipado === "SIM")
    expect(equipado.idItem).toBe(idItemB)

    const antigo = resultado.find((item: any) => item.idItem === idItemA)
    expect(antigo.equipado).toBe("NÃO")
  })
})