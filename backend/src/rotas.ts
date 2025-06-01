import { Router } from "express"
import { cadastrarUsuario } from "./controladores/cadastro"
import { loginUsuario } from "./controladores/login"
import Tarefa from "./modelos/Tarefa"
import { adicionarTarefa, editarTarefa, excluirTarefa, listarTarefas, marcarTarefaComoConcluida } from "./controladores/tarefa"
import { listarMissoes } from "./controladores/missoes"
import { carregarUsuario, verificarAcessoHandler, verificarMissoesMiddleware } from "./utilitarios/middlewares"
import { editarPerfil, exibirPerfil } from "./controladores/perfil"
import { pegarMoedasUsuario } from "./controladores/exibirMoedas"
import { adicionarHabito, editarHabito, excluirHabito, listarHabitos, marcarHabitoComoConcluido } from "./controladores/habitos"
import { RequestComUsuario } from "./modelos/request"
import { comprarItem, equiparItem, listarInventario } from "./controladores/itens"
import path from "path"
import Habito from "./modelos/habitos"

const rotas = Router()

//cadastrar usuário
rotas.post('/cadastrar', async (req, res) => {
  try {
    const dados = req.body

    const mensagem = await cadastrarUsuario({
      ...dados,
      missoesFeitas: dados.missoesFeitas || 0,
    })

    res.status(201).json({ sucesso: true, mensagem })
  } catch (erro: any) {
    res.status(400).json({ sucesso: false, mensagem: erro.message })
  }
})
//login
rotas.post('/login', async (req, res) => {
    const { emailOuCpf, senha } = req.body;

    try {
        const resultado = await loginUsuario(emailOuCpf, senha);
        
        res.status(200).json({ 
            message: resultado.mensagem,
            userId: resultado.userId 
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});
//verificar primeiro acesso
rotas.get('/usuario/primeiro-acesso/:id', carregarUsuario, verificarAcessoHandler)
//listar tarefas
rotas.get('/tarefas/:idUsuario', async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario)
    const tarefas = await listarTarefas(idUsuario)
    res.json(tarefas)
  } catch (erro) {
    const error = erro as Error
    res.status(500).json({ erro: error.message })
  }
})
//adicionar tarefa
rotas.post('/tarefas/:idUsuario/adicionar', async (req, res) => {
    try {
        // Pega o ID diretamente da URL e converte para número
        const idUsuario = parseInt(req.params.idUsuario, 10);
        
        // Validação robusta do ID
        if (isNaN(idUsuario)) {
            throw new Error('ID do usuário deve ser um número válido');
        }

        // Extrai os dados do corpo da requisição
        const { nome, descricao, prioridade, categoria, dataLimite } = req.body;

        // Cria a tarefa com o ID convertido
        const novaTarefa = new Tarefa(
            descricao,
            'pendente',
            idUsuario, // Já é number
            nome,
            prioridade,
            categoria,
            dataLimite
        );

        // Chama a função de adicionar tarefa
        const resultado = await adicionarTarefa(novaTarefa);
        
        res.status(201).json({ 
            success: true,
            message: resultado 
        });
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ 
                success: false,
                message: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false,
                message: 'Erro interno no servidor' 
            });
        }
    }
});
//editar tarefa
rotas.put('/editarTarefa/:id', async (req, res) => {
    console.log('REQ BODY:', req.body);//nao remova esse console ele é aquele pedaço inútil de código que faz todo o resto funcionar
    const idTarefa = Number(req.params.id)
    const { nome, descricao, dataLimite, prioridade, categoria} = req.body

    try {
        const dadosAtualizados: Partial<Tarefa> = {
            nome,
            descricao,
            dataLimite,
            prioridade,
            categoria
        }

        const mensagem = await editarTarefa(idTarefa, dadosAtualizados)
        res.status(200).json({mensagem})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ erro: error.message})
        } else {
            res.status(500).json({ erro: 'Erro desconhecido.'})
        }
    }
})
//marcar tarefa como concluida
rotas.put('/tarefa/:id/concluir', async (req, res, next) => {
  const idTarefa = Number(req.params.id);
  
  try {
    const resultado = await marcarTarefaComoConcluida(idTarefa);
    
    // Armazena tanto a mensagem quanto o novo status
    res.locals.tarefaInfo = {
      mensagem: resultado.mensagem,
      novoStatus: resultado.novoStatus
    };
    
    next();
  } catch (erro: any) {
    res.status(400).json({ erro: erro.message });
  }
}, verificarMissoesMiddleware, (req, res) => {
  // Retorna a mensagem e o novo status para o frontend
  res.status(200).json({ 
    mensagem: res.locals.mensagem || "Operação concluída",
    status: res.locals.tarefaInfo.novoStatus
  });
});
//excluir tarefa
rotas.delete('/tarefas/:id', async (req, res) => {
    try {
        const idTarefa = parseInt(req.params.id);
        if (isNaN(idTarefa)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const resultado = await excluirTarefa(idTarefa);
        res.status(200).json({ mensagem: resultado });
    } catch (erro) {
        res.status(erro instanceof Error && erro.message === 'Tarefa não encontrada.' ? 404 : 500)
           .json({ erro: erro instanceof Error ? erro.message : 'Erro desconhecido' });
    }
});
//listar missões
rotas.get('/missoes/:idUsuario', async (req, res) => {
    try {
        const {idUsuario} = req.params
        const missoes = await listarMissoes(Number(idUsuario))
        res.status(200).json(missoes)
    } catch (erro) {
        console.error(erro)
        res.status(500).json({ mensagem: 'Erro ao buscar missões.'})
    }
})
//exibir perfil
rotas.get('/perfil/:idUsuario', carregarUsuario, async (req, res) => {
    try {
        const idUsuario = req.params.idUsuario
        const perfil = await exibirPerfil(Number(idUsuario))
        res.json(perfil)
    }catch (erro: any) {
        res.status(400).json({ erro: erro.message})
    }
})
//editar perfil
rotas.put('/:idUsuario', async (req,res) => {
  try {
    const id = Number(req.params.idUsuario)
    const mensagem = await editarPerfil(id, req.body)
    res.status(200).json({mensagem})
  }catch (erro: any){
    res.status(400).json({ erro: erro.message})
  }
})
//exibir moedas
rotas.get('/moedas/:idUsuario', async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario

    const moedas = await pegarMoedasUsuario(Number(idUsuario))
    res.json({ moedas })
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
})
// Adicionar hábito
rotas.post('/habitos/:idUsuario/adicionar', async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario)
    
    // Validação do ID
    if (isNaN(idUsuario)) {
      throw new Error('ID do usuário inválido')
    }

    const { nome, descricao } = req.body

    // Validação dos campos obrigatórios
    if (!nome) {
      throw new Error('Nome do hábito é obrigatório')
    }

    const mensagem = await adicionarHabito({
      idUsuario,
      nome,
      descricao: descricao || '',
      status: 'pendente'
    })

    res.status(201).json({ 
      sucesso: true, 
      mensagem,
      idUsuario // Retornando o ID para referência
    })
  } catch (erro: any) {
    res.status(400).json({ 
      sucesso: false, 
      mensagem: erro.message 
    })
  }
})
// Editar hábito
rotas.put('/habitos/:idHabito', async (req, res) => {
  console.log('REQ BODY:', req.body);
  const idHabito = Number(req.params.idHabito)
  console.log(idHabito);
    const { nome, descricao} = req.body

    try {
        const dadosAtualizados: Partial<Habito> = {
            nome,
            descricao
        }

        const mensagem = await editarHabito(idHabito, dadosAtualizados)
        res.status(200).json({mensagem})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ erro: error.message})
        } else {
            res.status(500).json({ erro: 'Erro desconhecido.'})
        }
    }
})
// Excluir hábito
rotas.delete('/habitos/:idHabito', async (req, res) => {
  try {
    const idHabito = Number(req.params.idHabito)
    const mensagem = await excluirHabito(idHabito)
    res.status(200).json({ mensagem })
  } catch (erro: any) {
    res.status(404).json({ erro: erro.message })
  }
})
// Marcar ou desmarcar hábito como concluído
rotas.put('/habitos/:idHabito/concluir', async (req, res) => {
  const idHabito = Number(req.params.idHabito);

  try {
    const resultado = await marcarHabitoComoConcluido(idHabito);

    res.status(200).json({
      mensagem: resultado.mensagem,
      status: resultado.concluidoHoje ? "concluido" : "pendente"
    });
  } catch (erro: any) {
    res.status(400).json({ erro: erro.message });
  }
});
//comprar itens na loja
rotas.post('/loja/comprar', async (req, res) => {
  try{
    const { idItem, equipar} = req.body
    const usuario = (req as RequestComUsuario).usuario

    if(!usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" })
    }

    const mensagem = await comprarItem(usuario.idUsuario, idItem, equipar)
    res.status(200).json({ mensagem })
  }catch (erro: any) {
    res.status(400).json({ erro: erro.menssage})
  }
})
// rotas/inventario.ts
rotas.get('/inventario', carregarUsuario, async (req, res) => {
  try {
    const idUsuario = (req as RequestComUsuario).usuario?.idUsuario
    const itens = await listarInventario(Number(idUsuario))
    res.json(itens)
  } catch (erro: any) {
    res.status(500).json({ erro: erro.message })
  }
})
//equipar item
rotas.patch('/inventario/:idItem/equipar', carregarUsuario, async (req, res) => {
  try {
    const idUsuario = (req as RequestComUsuario).usuario?.idUsuario
    const idItem = Number(req.params.idItem)
    const mensagem = await equiparItem(Number(idUsuario), idItem)
    res.status(200).json({ mensagem })
  } catch (erro: any) {
    res.status(400).json({ erro: erro.message })
  }
})
//listar habitos
rotas.get('/habitos/:idUsuario', async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario)
    const habitos = await listarHabitos(idUsuario)
    res.status(200).json(habitos)
  } catch (erro: any) {
    res.status(500).json({ erro: erro.message })
  }
})

export default rotas