import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function pegarMoedasUsuario(idUsuario: number) {
  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

  const usuario = await db.get(
    `SELECT moedas FROM Usuario WHERE idUsuario = ?`,
    [idUsuario]
  )

  await db.close()

  if (!usuario) {
    throw new Error("Usuário não encontrado")
  }

  return usuario.moedas
}