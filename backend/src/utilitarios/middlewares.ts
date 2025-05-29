import { Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { RequestComUsuario } from "../modelos/request";
import { verificarPrimeiroAcesso } from "../controladores/tutorial";
import { verificarMissoes } from "../controladores/missoes";

export async function carregarUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const idUsuario = req.params.id || req.headers["x-user-id"]; // ou de token

    if (!idUsuario) {
      return res.status(400).json({ erro: "ID do usuário não fornecido" })
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
      return res.status(404).json({ erro: "Usuário não encontrado" })
    }

    // Anexa os dados ao objeto de requisição
    (req as any).usuario = usuario

    await db.close();

    next();
  } catch (erro) {
    console.error("Erro no middleware carregarUsuario:", erro)
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}

export async function verificarAcessoHandler(req: RequestComUsuario, res: Response) {
  try {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" })
    }

    const idUsuario = req.usuario.idUsuario;
    const primeiroAcesso = await verificarPrimeiroAcesso(idUsuario);

    res.json({ primeiroAcesso })
  } catch (error: any) {
    res.status(500).json({ erro: error.message })
  }
}

export async function verificarMissoesMiddleware(req: RequestComUsuario, res: Response, next: NextFunction) {
  try {
    const idUsuario = req.usuario?.idUsuario || req.body.idUsuario;
    if (idUsuario) {
      await verificarMissoes(idUsuario);
    }
    next();
  } catch (erro) {
    console.error("Erro ao verificar missões:", erro);
    next(); // ainda assim segue o fluxo mesmo se der erro
  }
}