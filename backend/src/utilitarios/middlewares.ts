import { Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { RequestComUsuario } from "../modelos/request";
import { verificarPrimeiroAcesso } from "../controladores/tutorial";
import { verificarMissoes } from "../controladores/missoes";
import { conectarBanco } from "./conexaoBD";

// Middleware para carregar usuário pelo ID
export async function carregarUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const idUsuario = req.params.id || req.headers["x-user-id"]; // ou de token

    if (!idUsuario) {
      return res.status(400).json({ erro: "ID do usuário não fornecido" });
    }

    const db = await open({
      filename: "./db/app.db",
      driver: sqlite3.Database,
    });

    const usuario = await db.get(
      `SELECT * FROM Usuario WHERE idUsuario = ?`,
      [idUsuario]
    );

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Anexa os dados ao objeto de requisição
    (req as any).usuario = usuario;

    await db.close();

    next();
  } catch (erro) {
    console.error("Erro no middleware carregarUsuario:", erro);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}

// Handler para verificar primeiro acesso
export async function verificarAcessoHandler(req: RequestComUsuario, res: Response) {
  try {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    const idUsuario = req.usuario.idUsuario;
    const primeiroAcesso = await verificarPrimeiroAcesso(idUsuario);

    res.json({ primeiroAcesso });
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

// Middleware para verificar missões ao concluir tarefa ou adicionar hábito
export async function verificarMissoesMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    let idUsuario: number | undefined;

    // Para tarefas (concluir)
    if (req.params.id) {
      const idTarefa = Number(req.params.id);
      if (!isNaN(idTarefa)) {
        const db = await conectarBanco();
        const tarefa = await db.get("SELECT idUsuario FROM Tarefa WHERE idTarefa = ?", [idTarefa]);
        idUsuario = tarefa?.idUsuario;
        console.log("[verificarMissoesMiddleware] idUsuario encontrado via tarefa:", idUsuario);
      }
    }

    // Para hábitos (adicionar)
    if (!idUsuario && req.params.idUsuario) {
      idUsuario = Number(req.params.idUsuario);
      console.log("[verificarMissoesMiddleware] idUsuario encontrado via req.params.idUsuario:", idUsuario);
    }

    // Para casos em que o idUsuario está no body
    if (!idUsuario && req.body.idUsuario) {
      idUsuario = Number(req.body.idUsuario);
      console.log("[verificarMissoesMiddleware] idUsuario encontrado via req.body.idUsuario:", idUsuario);
    }

    if (idUsuario) {
      console.log("[verificarMissoesMiddleware] Chamando verificarMissoes para idUsuario:", idUsuario);
      await verificarMissoes(idUsuario);
      console.log("[verificarMissoesMiddleware] verificarMissoes executado para idUsuario:", idUsuario);
    } else {
      console.warn("[verificarMissoesMiddleware] idUsuario não encontrado no contexto da requisição.");
    }
    next();
  } catch (erro) {
    console.error("[verificarMissoesMiddleware] Erro ao verificar missões:", erro);
    next();
  }
}