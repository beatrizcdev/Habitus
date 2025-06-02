import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function verificarPrimeiroAcesso(idUsuario: number): Promise<boolean> {
  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

  const usuario = await db.get(`SELECT primeiroAcesso FROM Usuario WHERE idUsuario = ?`, idUsuario)

  if (!usuario) throw new Error('Usuário não encontrado.')

  if (!usuario.primeiroAcesso) {
    const hoje = new Date().toISOString().split('T')[0]
    await db.run(`UPDATE Usuario SET primeiroAcesso = ? WHERE idUsuario = ?`, hoje, idUsuario)
    await db.close()
    return true // É o primeiro acesso
  }

  await db.close()
  return false // Já acessou antes
}