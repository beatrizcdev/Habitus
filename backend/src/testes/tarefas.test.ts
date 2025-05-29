import { adicionarTarefa, editarTarefa, excluirTarefa, marcarTarefaComoConcluida } from "../controladores/tarefa"
import Tarefa from "../modelos/Tarefa"
import {Database} from 'sqlite'
import { conectarBancoTeste } from "../utilitarios/conexaoBD"
import { deletarDadosTeste } from "../utilitarios/deletarDadosTestes"

describe('Funcionalidade de Adicionar Tarefa', () => {
    let db: Database

    //Conecta com o banco de dados
    beforeEach(async () => {
        db = await conectarBancoTeste()

        deletarDadosTeste()

        await db.run(`INSERT OR IGNORE INTO Usuario 
        (idUsuario, nome, senha, primeiroAcesso, telefone, nascimento, email, missoesFeitas, cpf, avatar, corAvatar)
        VALUES (1, 'Usuário Teste', 'senha', '2025-01-01', '123456789', '1990-01-01', 'teste@exemplo.com', 0, '12345678901', 'avatar.png', 'azul')`)
    })

    afterAll(async () => {
        deletarDadosTeste()
        await db.close()
    })

    it('deve adicionar uma tarefa válida com sucesso', async () => {
        const tarefa = new Tarefa(
            'Fazer teste',
            'pendente',
            1,
            'fazer tal coisa',
            'Alta',
            'Investimentos',
            '2025-12-31'
        )

        const resultado = await adicionarTarefa(tarefa)
        expect(resultado).toBe('Tarefa adicionada com sucesso!')
    })

    it('não deve adicionar tarefa com data no passado', async () => {
        const tarefa = new Tarefa(
            'Tarefa antiga',
            'pendente',
            1,
            'fazer tal coisa',
            'Média',
            'Contas a pagar',
            '2020-01-01'
        )

        await expect(adicionarTarefa(tarefa)).rejects.toThrow('A data limite não pode estar no passado.')
    })

    it('não deve adicionar tarefa com campos obrigatórios vazios', async () => {

        const tarefa = new Tarefa(
            '',        // descrição vazia
            '',        // status vazio
            0,         // idUsuario inválido
            ''         // nome vazio 
        )

        await expect(adicionarTarefa(tarefa)).rejects.toThrow('Preencha todos os campos obrigatórios.')
    })


})

describe('Funcionalidade de Edição de Tarefa', () => {
    let db: Database
    let idTarefaCriada: number

    beforeEach(async () => {
        db = await conectarBancoTeste()

        //Limpar a tabela de tarefas
        await deletarDadosTeste()

        //Inserir tarefa base para editar depois
        const resultado = await db.run(
            `INSERT INTO tarefa (descricao, status, idUsuario, nome, prioridade, categoria, dataLimite)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['Tarefa Original', 'pendente', 1, 'tal coisa', 'Baixa', 'Geral', '2099-12-31']
        )

        idTarefaCriada = resultado.lastID!

    })

    afterAll(async () => {
        await db.close()
    })

    it('deve editar uma tarefa com sucesso', async () => {
        const dadosAtualizados: Partial<Tarefa> = {
            descricao: 'Tarefa Atualizada',
            nome: 'tarefa tal',
            prioridade: 'Alta',
            categoria: 'Investimentos',
            dataLimite: '2100-01-01',
        }

        const resultado = await editarTarefa(idTarefaCriada, dadosAtualizados)
        expect(resultado).toBe('Tarefa editada com sucesso!')

        const tarefaEditada = await db.get('SELECT * FROM tarefa WHERE idTarefa = ?', [idTarefaCriada])
        expect(tarefaEditada.descricao).toBe('Tarefa Atualizada')
        expect(tarefaEditada.prioridade).toBe('Alta')
        expect(tarefaEditada.nome).toBe('tarefa tal')
        expect(tarefaEditada.categoria).toBe('Investimentos')
        expect(tarefaEditada.dataLimite).toBe('2100-01-01')
    })

    it('deve lançar erro ao tentar salvar sem nome', async () => {
        const dadosInvalidos: Partial<Tarefa> = {
            descricao: '',
            nome: '',
            prioridade: 'Alta'
        }

        await expect(
            editarTarefa(idTarefaCriada, dadosInvalidos)
        ).rejects.toThrow('A tarefa deve ter um nome e descrição')
    })

    it('deve lançar erro ao passar data no passado', async () => {
        const dadosInvalidos: Partial<Tarefa> = {
            descricao: 'Tarefa com data passada',
            nome: 'nome da tarefa',
            dataLimite: '2000-01-01'
        }

        await expect(
            editarTarefa(idTarefaCriada, dadosInvalidos)
        ).rejects.toThrow('A data de entrega não pode estar no passado.')
    });

    it('deve lançar erro se tarefa não existir', async () => {
        const dados: Partial<Tarefa> = {
            descricao: 'Nova descrição',
            nome: 'nome da tarefa',
            dataLimite: '2100-01-01'
        }

        await expect(
            editarTarefa(99999, dados) // idTarefa que não existe
        ).rejects.toThrow('Tarefa não encontrada')
    });
})

describe('Marcar tarefa como concluída', () => {
    let db: Database
    let userId: number
    let tarefaId: number

    beforeAll(async () => {
        db = await conectarBancoTeste()
        await deletarDadosTeste()

        const resultUser = await db.run(`
            INSERT INTO Usuario (nome, senha, cpf, moedas)
            VALUES ('Teste', '1234', '00000000002', 0)
        `)
        userId = resultUser.lastID!

        const resultTarefa = await db.run(`
            INSERT INTO tarefa (descricao, status, idUsuario, nome)
            VALUES ('Tarefa teste', 'pendente', ?, 'Tarefa 1')
        `, [userId]);
        tarefaId = resultTarefa.lastID!
    })
    afterAll(async () =>{
        await db.close()
        await deletarDadosTeste()
    })
    it('Deve atualizar o status da tarefa e adicionar uma moeda ao usuário', async () => {
        const resultado = await marcarTarefaComoConcluida(tarefaId);
        expect(resultado).toBe('Tarefa concluída com sucesso!')

        const tarefaAtualizada = await db.get('SELECT status FROM tarefa WHERE idTarefa = ?', tarefaId)
        const usuarioAtualizado = await db.get('SELECT moedas FROM Usuario WHERE idUsuario = ?', userId)

        expect(tarefaAtualizada.status).toBe('concluída')
        expect(usuarioAtualizado.moedas).toBe(1)
    })
})

describe('Função excluirTarefa', () => {
  let db: any
  let idNovaTarefa: number

  beforeAll(async () => {
    db = await conectarBancoTeste()

    // Cria uma tarefa fictícia para teste
    const resultado = await db.run(`
      INSERT INTO tarefa (descricao, status, idUsuario, nome, prioridade, categoria, dataLimite)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Tarefa teste', 'pendente', 1, 'tal tarefa', 'média', 'geral', '2025-12-31']
    )

    idNovaTarefa = resultado.lastID;
  })

  it('Deve excluir uma tarefa existente', async () => {
    const mensagem = await excluirTarefa(idNovaTarefa);
    expect(mensagem).toBe('Tarefa excluída com sucesso.')

    const tarefa = await db.get('SELECT * FROM tarefa WHERE idTarefa = ?', idNovaTarefa);
    expect(tarefa).toBeUndefined()
  })

  it('Deve lançar erro ao tentar excluir tarefa inexistente', async () => {
    await expect(excluirTarefa(999999)).rejects.toThrow('Tarefa não encontrada.')
  });

  afterAll(async () => {
    await db.close()
  })
})