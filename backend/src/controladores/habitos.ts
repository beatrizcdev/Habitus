import Habito from "../modelos/habitos"
import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function listarHabitos(idUsuario: number): Promise<Habito[]> {
  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

  const habitos = await db.all(`SELECT * FROM habito WHERE idUsuario = ?`, [idUsuario])
  await db.close()

  return habitos
}

export async function adicionarHabito(habito: Habito): Promise<string> {

    //validação de campos
    if (!habito.descricao || !habito.status || !habito.idUsuario){
        throw new Error('Preencha todos os campos obrigatórios.')
    }

    const db = process.env.NODE_ENV === 'test'
        ? await conectarBancoTeste()
        : await conectarBanco()

    await db.run(
        `INSERT INTO Habito (idUsuario, nome, status, descricao)
        VALUES(?,?,?,?)`,

        [
            habito.idUsuario,
            habito.nome,
            habito.status,
            habito.descricao,
        ]
    )

    return 'Habito adicionado com sucesso!'
    
}

export async function editarHabito(idHabito: number, dadosAtualizados: Partial<Habito>): Promise<string> {

    if(!dadosAtualizados.descricao){
        throw new Error('O hábito deve ter um nome e descrição.')
    }

    if(!dadosAtualizados.nome){
        throw new Error('O hábito deve ter um nome e descrição.')
    }

    if(!dadosAtualizados.status){
        throw new Error('O hábito deve ter um nome e descrição.')
    }

    //acessando banco de dados
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //modificando banco de dados
    const resultado = await db.run(
        `UPDATE Habito
        SET nome = ?, status = ?, descricao = ?
        WHERE idHabito = ?`,

        [
            dadosAtualizados.nome, 
            dadosAtualizados.status,
            dadosAtualizados.descricao,
            idHabito
        ]
    )

    if(resultado.changes === 0){
        throw new Error('Habito não encontrado ou dados idênticos aos já salvos.')
    }

    return 'Habito editado com sucesso!'
}

export async function excluirHabito(idHabito: number): Promise<string> {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //verifica a existência da tarefa
    const habito = await db.get(`SELECT idUsuario, status FROM Habito WHERE idHabito = ?`, idHabito)
    if (!habito) {
        throw new Error('Habito não encontrado.')
    }

     // Exclui o hábito
    await db.run('DELETE FROM Habito WHERE idHabito = ?', idHabito)

    await db.close()
    return 'Habito excluído com sucesso.'
}

export async function marcarHabitoComoConcluido(idHabito: number): Promise<string> {
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //verifica a existência da tarefa
    const habito = await db.get(`SELECT idUsuario, status FROM Habito WHERE idHabito = ?`, idHabito)
    if (!habito) {
        throw new Error('Habito não encontrado.')
    }

    if(habito.status === 'concluido') {
        
        await db.run(`UPDATE Habito SET status = ? WHERE idHabito = ?`, 'pendente', idHabito)
        await db.run(`UPDATE Usuario SET moedas = moedas - 1 WHERE idUsuario = ?`, habito.idUsuario)

        return 'Tarefa reativada com sucesso.'
    }

    //se o habito não estiver concluído marca como concluído
    await db.run(`UPDATE Habito SET status = ? WHERE idHabito = ?`, 'concluido', idHabito)
    await db.run(`UPDATE Usuario SET moedas = moedas + 1 WHERE idUsuario = ?`, habito.idUsuario)

    return 'Habito concluída com sucesso!'
}

export async function resetarHabitosDiarios(): Promise<void> {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    await db.run(`UPDATE Habito SET status = 'pendente' WHERE status != 'pendente' `)

    await db.close()
    console.log('[cron] Hábitos resetados para "pendente".')
}