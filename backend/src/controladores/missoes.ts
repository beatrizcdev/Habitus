import { conectarBanco, conectarBancoTeste } from "../utilitarios/conexaoBD"
import { enviarNotificacao } from "./notificacoes"



//Listar missões
export async function listarMissoes(idUsuario: number) {

  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

   const sql = `
    SELECT 
      m.idMissao, 
      m.nome, 
      m.descricao, 
      m.meta, 
      COALESCE(mu.statusMissao, 'pendente') as statusMissao
      FROM Missao m
      JOIN Missao_Usuario mu ON m.idMissao = mu.idMissao
      WHERE mu.idUsuario = ?
      ORDER BY m.idMissao
    `

    const result = await db.all(sql, [idUsuario])
    await db.close()
    
    return Array.from(result)
}
//verficar e marcar como concluída uma missão
export async function verificarMissoes(idUsuario: number): Promise<void> {
  
  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

  //buscar missões pendentes do usuário
  const missoes = await db.all(`
    SELECT m.*, mu.statusMissao FROM Missao_Usuario mu
    JOIN Missao m ON mu.idMissao = m.idMissao
    WHERE mu.idUsuario = ? AND (mu.statusMissao IS NULL OR mu.statusMissao = 'pendente')`, [idUsuario])

    for (const missao of missoes) {
      let progresso = 0

      if (missao.tipo === 'tarefas') {
        const result = await db.get(`
          SELECT COUNT(*) as total FROM Tarefa
          WHERE idUsuario = ? AND status = 'concluida'
        `, [idUsuario])
        progresso = result.total

      } else if (missao.tipo === 'streak') {
        const result = await db.get(`
          SELECT streak FROM Usuario WHERE idUsuario = ?
        `, [idUsuario])
        progresso = result.streak || 0
      }

    if (progresso >= missao.meta) {
      await db.run(`
        UPDATE Missao_Usuario
        SET statusMissao = 'concluida'
        WHERE idUsuario = ? AND idMissao = ?
        `, [idUsuario, missao.idMissao]
      )

      if (missao.idRecompensa) {
        const item = await db.get(`
          SELECT * FROM Item WHERE idItem = ?
          `, [missao.idRecompensa]
        )

        if (item) {
          await db.run(`
            INSERT INTO Item_Usuario (idItem, idUsuario, equipado, dataCompra)
            VALUES (?, ?, 'NÃO', DATE('now'))
            `, [item.idItem, idUsuario]
          )

          await enviarNotificacao(
            idUsuario,
            `Missão concluída! Você ganhou o item "${item.nome}".`,
            "missao"
          )

          continue
          
        }
      }

      await db.run(`
        UPDATE Usuario SET moedas = moedas + ? WHERE idUsuario = ?
        `, [missao.recompensa, idUsuario]
      )

      await enviarNotificacao(
        idUsuario,
        `Missão concluída! Você ganhou ${missao.recompensa} moedas.`,
        "missao"
      )
    }
  }
  await db.close()
}