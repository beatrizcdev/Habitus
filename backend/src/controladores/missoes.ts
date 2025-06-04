import { conectarBanco, conectarBancoTeste } from "../utilitarios/conexaoBD";
import { enviarNotificacao } from "./notificacoes";

// Listar missões
export async function listarMissoes(idUsuario: number) {
  const db =
    process.env.NODE_ENV === "test"
      ? await conectarBancoTeste()
      : await conectarBanco();

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
    `;

  const result = await db.all(sql, [idUsuario]);
  await db.close();

  return Array.from(result);
}

// Verificar e marcar como concluída uma missão
export async function verificarMissoes(idUsuario: number): Promise<void> {
  const db =
    process.env.NODE_ENV === "test"
      ? await conectarBancoTeste()
      : await conectarBanco();

  // Buscar missões pendentes do usuário
  const missoes = await db.all(
    `
    SELECT m.*, mu.statusMissao FROM Missao_Usuario mu
    JOIN Missao m ON mu.idMissao = m.idMissao
    WHERE mu.idUsuario = ? AND (mu.statusMissao IS NULL OR mu.statusMissao = 'pendente')`,
    [idUsuario]
  );

  for (const missao of missoes) {
    let progresso = 0;

    if (missao.tipo === "tarefas") {
      const result = await db.get(
        `
          SELECT COUNT(*) as total FROM tarefa
          WHERE idUsuario = ? AND status = 'concluída'
        `,
        [idUsuario]
      );
      progresso = result.total;
    } else if (missao.tipo === "streak") {
      const result = await db.get(
        `
          SELECT diasSeguidos FROM Usuario WHERE idUsuario = ?
        `,
        [idUsuario]
      );
      progresso = result.diasSeguidos || 0;
    } else if (missao.tipo === "habitos") {
      const result = await db.get(`
          SELECT COUNT(*) as total FROM Habito
          WHERE idUsuario = ?
        `,
        [idUsuario]
      );
      progresso = result.total;
    }

    // LOG DETALHADO
    console.log(`[verificarMissoes] Missao: ${missao.nome} | Tipo: ${missao.tipo} | Progresso: ${progresso} | Meta: ${missao.meta} | Status: ${missao.statusMissao}`);

    if (progresso >= missao.meta) {
      const updateResult = await db.run(
        `
        UPDATE Missao_Usuario
        SET statusMissao = 'concluida'
        WHERE idUsuario = ? AND idMissao = ?
        `,
        [idUsuario, missao.idMissao]
      );
      console.log("[verificarMissoes] Missao atualizada:", updateResult);

      // INCREMENTA O CONTADOR DE MISSÕES FEITAS
      await db.run(
        `UPDATE Usuario SET missoesFeitas = COALESCE(missoesFeitas,0) + 1 WHERE idUsuario = ?`,
        [idUsuario]
      );

      if (missao.idRecompensa) {
        const item = await db.get(
          `
          SELECT * FROM Item WHERE idItem = ?
          `,
          [missao.idRecompensa]
        );

        if (item) {
          // Verifica se é badge para equipar automaticamente
          const equipado = item.tipo === 'badge' ? 'SIM' : 'NÃO';

          await db.run(
            `
            INSERT INTO Item_Usuario (idItem, idUsuario, equipado, dataCompra)
            VALUES (?, ?, ?, DATE('now'))
            `,
            [item.idItem, idUsuario, equipado]
          );

          await enviarNotificacao(
            idUsuario,
            `Missão concluída! Você ganhou o item "${item.nome}".`,
            "missao"
          );

          continue;
        }
      }

      await db.run(
        `
        UPDATE Usuario SET moedas = moedas + ? WHERE idUsuario = ?
        `,
        [missao.recompensa, idUsuario]
      );

      await enviarNotificacao(
        idUsuario,
        `Missão concluída! Você ganhou ${missao.recompensa} moedas.`,
        "missao"
      );
    }
  }
  await db.close();
}
