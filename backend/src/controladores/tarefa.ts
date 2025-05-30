import Tarefa from '../modelos/Tarefa'
import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function adicionarTarefa(tarefa: Tarefa): Promise<string> {
    // Validação de campos
    if (!tarefa.descricao || !tarefa.idUsuario || !tarefa.nome) {
        throw new Error('Preencha todos os campos obrigatórios.');
    }

    // Definir status padrão explicitamente
    const status = tarefa.status || 'pendente';

    if (tarefa.dataLimite) {
        const hoje = new Date().toISOString().split('T')[0];
        if (tarefa.dataLimite < hoje) {
            throw new Error('A data limite não pode estar no passado.');
        }
    }

    const db = process.env.NODE_ENV === 'test'
        ? await conectarBancoTeste()
        : await conectarBanco();

    try {
        await db.run(
            `INSERT INTO tarefa (descricao, nome, idUsuario, prioridade, categoria, dataLimite, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                tarefa.descricao,
                tarefa.nome,
                tarefa.idUsuario,
                tarefa.prioridade,
                tarefa.categoria,
                tarefa.dataLimite,
                status // Incluindo o status na query
            ]
        );
        return 'Tarefa adicionada com sucesso!';
    } finally {
        await db.close();
    }
}

export async function editarTarefa(idTarefa: number, dadosAtualizados: Partial<Tarefa>): Promise<string> {

    if (!dadosAtualizados.descricao || !dadosAtualizados.nome) {
        throw new Error('A tarefa deve ter um nome e descrição.')
    }

    if(dadosAtualizados.dataLimite){
        const hoje = new Date().toISOString().split('T')[0]
        if(dadosAtualizados.dataLimite < hoje){
            throw new Error('A data de entrega não pode estar no passado.')
        }
    }

    //acessando banco de dados
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    // Verifica se a tarefa existe
    const tarefaExistente = await db.get(
        'SELECT 1 FROM tarefa WHERE idTarefa = ?',
        [idTarefa]
    )
    
    if (!tarefaExistente) {
        await db.close()
        throw new Error('Tarefa não encontrada')
    }

    const tarefaAtual = await db.get('SELECT * FROM tarefa WHERE idTarefa = ?', [idTarefa]);

    const statusFinal = dadosAtualizados.status ?? tarefaAtual.status ?? 'pendente';


    //modificando banco de dados
    const resultado = await db.run(
        `UPDATE tarefa
        SET descricao = ?, nome = ?, dataLimite = ?, prioridade = ?, categoria = ?, status = ?
        WHERE idTarefa = ?`,

        [
            dadosAtualizados.descricao,
            dadosAtualizados.nome,
            dadosAtualizados.dataLimite,
            dadosAtualizados.prioridade,
            dadosAtualizados.categoria,
            statusFinal,
            idTarefa
        ]
    )

    await db.close()

    if(resultado.changes === 0){
        throw new Error('Dados idênticos aos já salvos.')
    }

    return 'Tarefa editada com sucesso!'
}

export async function marcarTarefaComoConcluida(idTarefa: number): Promise<string> {
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //verifica a existência da tarefa
    const tarefa = await db.get(`SELECT idUsuario, status FROM tarefa WHERE idTarefa = ?`, idTarefa)
    if (!tarefa) {
        throw new Error('Tarefa não encontrada.')
    }

    if(tarefa.status === 'concluída') {
        
        await db.run(`UPDATE tarefa SET status = ? WHERE idTarefa = ?`, 'pendente', idTarefa)
        await db.run(`UPDATE Usuario SET moedas = moedas - 1 WHERE idUsuario = ?`, tarefa.idUsuario)

        await db.close()
        return 'Tarefa reativada com sucesso.'
    }

    //se a tarefa não estiver concluída marca como concluída
    await db.run(`UPDATE tarefa SET status = ? WHERE idTarefa = ?`, 'concluída', idTarefa)
    await db.run(`UPDATE Usuario SET moedas = moedas + 1 WHERE idUsuario = ?`, tarefa.idUsuario)

    await db.close()
    return 'Tarefa concluída com sucesso!'
}

export async function excluirTarefa(idTarefa: number): Promise<string> {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //verifica a existência da tarefa
    const tarefa = await db.get(`SELECT idUsuario, status FROM tarefa WHERE idTarefa = ?`, idTarefa)
    if (!tarefa) {
        throw new Error('Tarefa não encontrada.')
    }

     // Exclui a tarefa
    await db.run('DELETE FROM tarefa WHERE idTarefa = ?', idTarefa)

    await db.close()
    return 'Tarefa excluída com sucesso.'
}

export async function listarTarefas(idUsuario: number): Promise<Tarefa[]> {
  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

  const tarefas = await db.all<Tarefa[]>(
    `SELECT * FROM tarefa WHERE idUsuario = ?`,
    idUsuario
  )

  await db.close()
  return tarefas
}