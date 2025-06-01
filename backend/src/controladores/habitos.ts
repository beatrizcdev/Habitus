import Habito from "../modelos/habitos"
import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function listarHabitos(idUsuario: number): Promise<Habito[]> {
  const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

  const habitos = await db.all(`SELECT * FROM habito WHERE idUsuario = ?`, [idUsuario])
  await db.close()

  // Garante que status é sempre string
  return habitos.map(h => ({
    ...h,
    status: h.status === "concluido" ? "concluido" : "pendente"
  }))
}

export async function adicionarHabito(habito: Habito): Promise<string> {

    //validação de campos
    if (!habito.descricao || !habito.idUsuario || !habito.nome ){
        throw new Error('Preencha todos os campos obrigatórios.')
    }

    const status = habito.status || 'pendente';

    const db = process.env.NODE_ENV === 'test'
        ? await conectarBancoTeste()
        : await conectarBanco()

    await db.run(
        `INSERT INTO Habito (idUsuario, nome, status, descricao)
        VALUES(?,?,?,?)`,

        [
            habito.idUsuario,
            habito.nome,
            status,
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

    //acessando banco de dados
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //modificando banco de dados
    const resultado = await db.run(
        `UPDATE Habito
        SET nome = ?, descricao = ?
        WHERE idHabito = ?`,

        [
            dadosAtualizados.nome,
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

export async function marcarHabitoComoConcluido(idHabito: number): Promise<{ mensagem: string, concluidoHoje: boolean }> {
  const db = await conectarBanco();

  try {
    const habito = await db.get(`SELECT idUsuario, status FROM Habito WHERE idHabito = ?`, [idHabito]);
    if (!habito) throw new Error('Hábito não encontrado.');

    // Verifica se o hábito já está concluído
    const concluidoHoje = habito.status !== 'concluido';

    // Define novo status conforme o toggle
    const novoStatus = concluidoHoje ? 'concluido' : 'pendente';

    await db.run(`UPDATE Habito SET status = ? WHERE idHabito = ?`, [novoStatus, idHabito]);

    return {
      mensagem: concluidoHoje
        ? 'Hábito concluído com sucesso!'
        : 'Conclusão do hábito desfeita.',
      concluidoHoje
    };
  } finally {
    await db.close();
  }
}

export async function resetarHabitosDiarios(): Promise<void> {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    await db.run(`UPDATE Habito SET status = 'pendente' WHERE status != 'pendente' `)

    await db.close()
    console.log('[cron] Hábitos resetados para "pendente".')
}