import { conectarBanco, conectarBancoTeste } from "../utilitarios/conexaoBD";

export async function enviarNotificacao(
  idUsuario: number,
  mensagem: string,
  tipo: string = "sistema"
): Promise<void> {
  // Validação de existência de dados
  if (!idUsuario || !mensagem) {
    throw new Error(
      "Usuário e mensagem são obrigatórios para criar uma notificação."
    );
  }

  const db =
    process.env.NODE_ENV === "test"
      ? await conectarBancoTeste()
      : await conectarBanco();

  try {
    // Formatar data no formato YYYY-MM-DD
    const hoje = new Date();
    const dataEnvio = hoje.toISOString().split("T")[0];

    await db.run(
      `INSERT INTO Notificacao (idUsuario, mensagem, dataEnvio, tipo, lida)
            VALUES (?, ?, ?, ?, ?)`,
      [idUsuario, mensagem, dataEnvio, tipo, 0]
    );
  } finally {
    await db.close();
  }
}

// Listar missões
export async function listarNotificacoes(idUsuario: number) {
  const db =
    process.env.NODE_ENV === "test"
      ? await conectarBancoTeste()
      : await conectarBanco();

  const sql = `
  SELECT 
    n.idNotificacao,
    n.mensagem,
    n.dataEnvio,
    n.tipo,
    n.lida
  FROM Notificacao n
  WHERE n.idUsuario = ?
  ORDER BY n.dataEnvio DESC
`;

  const result = await db.all(sql, [idUsuario]);
  await db.close();

  return Array.from(result);
}
