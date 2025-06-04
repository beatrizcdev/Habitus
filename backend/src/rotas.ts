import { Router } from "express";
import { cadastrarUsuario } from "./controladores/cadastro";
import { loginUsuario } from "./controladores/login";
import Tarefa from "./modelos/Tarefa";
import {
  adicionarTarefa,
  editarTarefa,
  excluirTarefa,
  listarTarefas,
  marcarTarefaComoConcluida,
} from "./controladores/tarefa";
import { listarMissoes } from "./controladores/missoes";
import {
  carregarUsuario,
  verificarAcessoHandler,
  verificarMissoesMiddleware,
} from "./utilitarios/middlewares";
import { editarPerfil, exibirPerfil } from "./controladores/perfil";
import { pegarMoedasUsuario } from "./controladores/exibirMoedas";
import {
  adicionarHabito,
  editarHabito,
  excluirHabito,
  listarHabitos,
  marcarHabitoComoConcluido,
} from "./controladores/habitos";
import { RequestComUsuario } from "./modelos/request";
import {
  comprarItem,
  equiparItem,
  listarInventario,
  listarItensLoja,
} from "./controladores/itens";
import path from "path";
import Habito from "./modelos/habitos";
import { conectarBanco } from "./utilitarios/conexaoBD";
import { listarNotificacoes } from "./controladores/notificacoes";

const rotas = Router();

//cadastrar usuário
rotas.post("/cadastrar", async (req, res) => {
  try {
    const dados = req.body;

    const mensagem = await cadastrarUsuario({
      ...dados,
      missoesFeitas: dados.missoesFeitas || 0,
    });

    res.status(201).json({ sucesso: true, mensagem });
  } catch (erro: any) {
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
});

//login
rotas.post("/login", async (req, res) => {
  const { emailOuCpf, senha } = req.body;

  try {
    const resultado = await loginUsuario(emailOuCpf, senha);

    res.status(200).json({
      message: resultado.mensagem,
      userId: resultado.userId,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensagem: error.message });
    } else {
      res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
});

//verificar primeiro acesso
rotas.get(
  "/usuario/primeiro-acesso/:id",
  carregarUsuario,
  verificarAcessoHandler
);

//listar tarefas
rotas.get("/tarefas/:idUsuario", async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const tarefas = await listarTarefas(idUsuario);
    res.json(tarefas);
  } catch (erro) {
    const error = erro as Error;
    res.status(500).json({ mensagem: error.message });
  }
});

//adicionar tarefa
rotas.post("/tarefas/:idUsuario/adicionar", async (req, res) => {
  try {
    const idUsuario = parseInt(req.params.idUsuario, 10);
    if (isNaN(idUsuario)) {
      throw new Error("ID do usuário deve ser um número válido");
    }
    const { nome, descricao, prioridade, categoria, dataLimite } = req.body;
    const novaTarefa = new Tarefa(
      descricao,
      "pendente",
      idUsuario,
      nome,
      prioridade,
      categoria,
      dataLimite
    );
    const resultado = await adicionarTarefa(novaTarefa);
    res.status(201).json({
      success: true,
      message: resultado,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        mensagem: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        mensagem: "Erro interno no servidor",
      });
    }
  }
});

//editar tarefa
rotas.put("/editarTarefa/:id", async (req, res) => {
  console.log("REQ BODY:", req.body);
  const idTarefa = Number(req.params.id);
  const { nome, descricao, dataLimite, prioridade, categoria } = req.body;

  try {
    const dadosAtualizados: Partial<Tarefa> = {
      nome,
      descricao,
      dataLimite,
      prioridade,
      categoria,
    };

    const mensagem = await editarTarefa(idTarefa, dadosAtualizados);
    res.status(200).json({ mensagem });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensagem: error.message });
    } else {
      res.status(500).json({ mensagem: "Erro desconhecido." });
    }
  }
});

//marcar tarefa como concluida
rotas.put(
  "/tarefa/:id/concluir",
  async (req, res, next) => {
    const idTarefa = Number(req.params.id);

    try {
      const resultado = await marcarTarefaComoConcluida(idTarefa);

      res.locals.tarefaInfo = {
        mensagem: resultado.mensagem,
        novoStatus: resultado.novoStatus,
      };

      next();
    } catch (erro: any) {
      res.status(400).json({ mensagem: erro.message });
    }
  },
  verificarMissoesMiddleware,
  (req, res) => {
    res.status(200).json({
      mensagem: res.locals.mensagem || "Operação concluída",
      status: res.locals.tarefaInfo.novoStatus,
    });
  }
);

//excluir tarefa
rotas.delete("/tarefas/:id", async (req, res) => {
  try {
    const idTarefa = parseInt(req.params.id);
    if (isNaN(idTarefa)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const resultado = await excluirTarefa(idTarefa);
    res.status(200).json({ mensagem: resultado });
  } catch (erro) {
    res
      .status(
        erro instanceof Error && erro.message === "Tarefa não encontrada."
          ? 404
          : 500
      )
      .json({
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      });
  }
});

//listar missões
rotas.get("/missoes/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const missoes = await listarMissoes(Number(idUsuario));
    res.status(200).json(missoes);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro ao buscar missões." });
  }
});

//exibir perfil
rotas.get("/perfil/:idUsuario", carregarUsuario, async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const perfil = await exibirPerfil(Number(idUsuario));
    res.json(perfil);
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
});

//editar perfil
rotas.put("/:idUsuario", async (req, res) => {
  try {
    const id = Number(req.params.idUsuario);
    const mensagem = await editarPerfil(id, req.body);
    res.status(200).json({ mensagem });
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
});

//exibir moedas
rotas.get("/moedas/:idUsuario", async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const moedas = await pegarMoedasUsuario(Number(idUsuario));
    res.json({ moedas });
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Adicionar hábito
rotas.post(
  "/habitos/:idUsuario/adicionar",
  async (req, res, next) => {
    try {
      const idUsuario = Number(req.params.idUsuario);
      if (isNaN(idUsuario)) {
        throw new Error("ID do usuário inválido");
      }

      const { nome, descricao } = req.body;
      if (!nome) {
        throw new Error("Nome do hábito é obrigatório");
      }

      const mensagem = await adicionarHabito({
        idUsuario,
        nome,
        descricao: descricao || "",
        status: "pendente",
      });

      res.locals.habitoInfo = { mensagem, idUsuario };

      next();
    } catch (erro: any) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message,
      });
    }
  },
  verificarMissoesMiddleware,
  (req, res) => {
    res.status(201).json({
      sucesso: true,
      mensagem: res.locals.habitoInfo?.mensagem,
      idUsuario: res.locals.habitoInfo?.idUsuario,
    });
  }
);

// Editar hábito
rotas.put("/habitos/:idHabito", async (req, res) => {
  console.log("REQ BODY:", req.body);
  const idHabito = Number(req.params.idHabito);
  console.log(idHabito);
  const { nome, descricao } = req.body;

  try {
    const dadosAtualizados: Partial<Habito> = {
      nome,
      descricao,
    };

    const mensagem = await editarHabito(idHabito, dadosAtualizados);
    res.status(200).json({ mensagem });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensagem: error.message });
    } else {
      res.status(500).json({ mensagem: "Erro desconhecido." });
    }
  }
});

// Excluir hábito
rotas.delete("/habitos/:idHabito", async (req, res) => {
  try {
    const idHabito = Number(req.params.idHabito);
    const mensagem = await excluirHabito(idHabito);
    res.status(200).json({ mensagem });
  } catch (erro: any) {
    res.status(404).json({ mensagem: erro.message });
  }
});

// Marcar ou desmarcar hábito como concluído
rotas.put("/habitos/:idHabito/concluir", async (req, res) => {
  const idHabito = Number(req.params.idHabito);

  try {
    const resultado = await marcarHabitoComoConcluido(idHabito);

    res.status(200).json({
      mensagem: resultado.mensagem,
      status: resultado.concluidoHoje ? "concluido" : "pendente",
    });
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
});

//comprar itens na loja
rotas.post("/loja/comprar", async (req, res) => {
  try {
    console.log("REQ BODY /loja/comprar:", req.body);
    const { idUsuario, idItem } = req.body;

    if (!idUsuario) {
      console.log("idUsuario não informado!");
      return res.status(400).json({ mensagem: "idUsuario não informado" });
    }

    const mensagem = await comprarItem(idUsuario, idItem);
    console.log("Compra realizada:", mensagem);
    res.status(200).json({ mensagem });
  } catch (erro: any) {
    console.error("Erro ao comprar item:", erro);
    res.status(400).json({ mensagem: erro.message });
  }
});

// rotas/inventario.ts
rotas.get("/inventario", carregarUsuario, async (req, res) => {
  try {
    const idUsuario = (req as RequestComUsuario).usuario?.idUsuario;
    const itens = await listarInventario(Number(idUsuario));
    res.json(itens);
  } catch (erro: any) {
    res.status(500).json({ mensagem: erro.message });
  }
});

//equipar item
rotas.patch("/inventario/:idItem/equipar", async (req, res) => {
  try {
    const idUsuario = req.body.idUsuario;
    const idItem = Number(req.params.idItem);
    const mensagem = await equiparItem(Number(idUsuario), idItem);
    res.status(200).json({ mensagem });
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
});

//listar habitos
rotas.get("/habitos/:idUsuario", async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const habitos = await listarHabitos(idUsuario);
    res.status(200).json(habitos);
  } catch (erro: any) {
    res.status(500).json({ mensagem: erro.message });
  }
});

// Obter usuário por ID
rotas.get("/usuario/:id", async (req, res) => {
  const db = await conectarBanco();
  const usuario = await db.get("SELECT * FROM Usuario WHERE idUsuario = ?", [
    req.params.id,
  ]);
  if (!usuario)
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  res.json(usuario);
});

// Rota para listar todos os itens da loja
rotas.get("/loja/itens", async (req, res) => {
  try {
    const itens = await listarItensLoja();
    res.status(200).json(itens);
  } catch (erro: any) {
    res.status(500).json({ mensagem: erro.message });
  }
});

// Listar notificações do usuário
rotas.get("/notificacoes/:idUsuario", async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const notificacoes = await listarNotificacoes(idUsuario);
    console.log(
      "Notificações retornadas para o usuário",
      idUsuario,
      ":",
      notificacoes
    );
    res.json(notificacoes);
  } catch (erro: any) {
    console.error("Erro ao buscar notificações:", erro);
    res.status(500).json({ mensagem: erro.message });
  }
});

// Marcar notificações como lidas
rotas.put("/notificacoes/:idUsuario/ler", async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const db = await conectarBanco();
    await db.run("UPDATE Notificacao SET lida = 1 WHERE idUsuario = ?", [
      idUsuario,
    ]);
    await db.close();
    res.status(200).json({ mensagem: "Notificações marcadas como lidas." });
  } catch (erro: any) {
    res.status(500).json({ mensagem: erro.message });
  }
});

// Listar inventário de qualquer usuário pelo id (sem middleware)
rotas.get("/inventario/:idUsuario", async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const itens = await listarInventario(idUsuario);
    res.json(itens);
  } catch (erro: any) {
    res.status(500).json({ mensagem: erro.message });
  }
});

export default rotas;
