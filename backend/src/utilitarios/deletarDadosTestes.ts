import { conectarBancoTeste } from "./conexaoBD"

// função de deletar dados antes e depois dos testes
export async function deletarDadosTeste() {

  const db = await conectarBancoTeste()
  const tabelas = [
    "Notificacao",
    "Item_Usuario",
    "Tarefa",
    "Missao_Usuario",
    "Missao",
    "Item",
    "Usuario"
  ]

  for (const tabela of tabelas) {
    await db.run(`DELETE FROM ${tabela}`)
  }
  await db.close()
}