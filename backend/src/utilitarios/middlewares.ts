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

// Middleware para verificar missões ao concluir tarefa
export async function verificarMissoesMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const idTarefa = Number(req.params.id);
    if (!idTarefa) {
      console.log("[verificarMissoesMiddleware] idTarefa não fornecido.");
      return next();
    }

    const db = await conectarBanco();
    // Busca o idUsuario da tarefa no banco
    const tarefa = await db.get("SELECT idUsuario FROM Tarefa WHERE idTarefa = ?", [idTarefa]);
    const idUsuario = tarefa?.idUsuario;

    console.log("[verificarMissoesMiddleware] idTarefa:", idTarefa, "| idUsuario encontrado:", idUsuario);

    if (idUsuario) {
      await verificarMissoes(idUsuario);
      console.log("[verificarMissoesMiddleware] verificarMissoes executado para idUsuario:", idUsuario);
    } else {
      console.warn("[verificarMissoesMiddleware] idUsuario não encontrado para a tarefa", idTarefa);
    }
    next();
  } catch (erro) {
    console.error("[verificarMissoesMiddleware] Erro ao verificar missões:", erro);
    next();
  }
}