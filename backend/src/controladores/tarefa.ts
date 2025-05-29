import Tarefa from '../modelos/Tarefa'
import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function adicionarTarefa(tarefa: Tarefa): Promise<string> {

    //validação de campos
    if (!tarefa.descricao || !tarefa.idUsuario || !tarefa.nome){
        throw new Error('Preencha todos os campos obrigatórios.')
    }

    if (tarefa.dataLimite){
        const hoje = new Date().toISOString().split('T')[0]
        if (tarefa.dataLimite < hoje){
            throw new Error('A data limite não pode estar no passado.')
        }
    }

    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

        await db.run(
        `INSERT INTO tarefa (descricao, nome, idUsuario, prioridade, categoria, dataLimite)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            tarefa.descricao,
            tarefa.nome,
            tarefa.idUsuario,
            tarefa.prioridade,
            tarefa.categoria,
            tarefa.dataLimite,
        ]
        )
    await db.close()
    return 'Tarefa adicionada com sucesso!'  
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
            dadosAtualizados.status || 'pendente',
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