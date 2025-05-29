import { dadosAtualizacao } from '../modelos/InterfacePerfil'
import bcrypt from 'bcrypt'
import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'

export async function exibirPerfil(idUsuario: number) {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //buscar informações do usuário
    const usuario = await db.get(`
    SELECT nome, email, avatar, corAvatar
    FROM Usuario
    WHERE idUsuario = ?
  `, [idUsuario])

    if(!usuario) {
        throw new Error("Usuário não encontrado")
    }

    //selecionar badges visíveis 
    const badges = await db.all(`
    SELECT R.idRecompensa, R.origem
    FROM Usuario_Recompensa UR
    JOIN Recompensa R ON UR.idRecompensa = R.idRecompensa
    WHERE UR.idUsuario = ?
        AND UR.tipoRecompensa = 'Badge'
        AND R.origem = 'Missão'
    `, [idUsuario])

    // progresso: total de missões feitas / total de missões

    const total = await db.get(`SELECT COUNT(*) as total FROM Missao_Usuario WHERE idUsuario = ?`, [idUsuario])
    const concluidas = await db.get(`SELECT COUNT(*) as concluidas FROM Missao_Usuario WHERE idUsuario = ? AND statusMissao = 'concluida'`, [idUsuario])

    const progresso = {
        total: total.total,
        concluidas: concluidas.concluidas,
        percentual: total.total > 0 ? Math.round((concluidas.concluidas / total.total) * 100) : 0
    }

    await db.close()

    return {
        ...usuario,
        badges,
        progresso
    }
}

export async function editarPerfil(idUsuario: number, dados: dadosAtualizacao): Promise<string> {
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    const usuario = await db.get(`SELECT senha FROM Usuario WHERE idUsuario = ?`, idUsuario)

    if(!usuario){
        throw new Error('Usuário não encontrado.')
    }

    //confirmação da senha atual se for trocar email ou senha
    if((dados.email || dados.novaSenha) && !dados.senhaAtual) {
        throw new Error('Confirme sua senha atual para alterar email ou senha.')
    }

    if(dados.senhaAtual) {
        const senhaCorreta = await bcrypt.compare(dados.senhaAtual, usuario.senha)
        if(!senhaCorreta){
            throw new Error('Senha atual incorreta.')
        }
    }

    //Atualiza os dados informados
    if (dados.novaSenha) {

        if (!dados.senhaAtual) {
        throw new Error('Confirme sua senha atual para alterar e-mail ou senha.')
        }

        const senhaCorreta = await bcrypt.compare(dados.senhaAtual, usuario.senha)
        if (!senhaCorreta) {
            throw new Error('Senha atual incorreta.')
        }

        // Validação da nova senha: alfanumérica e exatamente 6 caracteres
        const senhaValida = /^[a-zA-Z0-9]{6}$/.test(dados.novaSenha)
        if (!senhaValida) {
            throw new Error('A nova senha deve ser alfanumérica e conter exatamente 6 caracteres.')
        }

        //após validação, grava a nova senha
        const hashNovaSenha = await bcrypt.hash(dados.novaSenha, 10)
        await db.run(`UPDATE Usuario SET senha = ? WHERE idUsuario = ?`, hashNovaSenha, idUsuario)
    }

    if (dados.email) {
        await db.run(`UPDATE Usuario SET email = ? WHERE idUsuario = ?`, dados.email, idUsuario)
    }

    if (dados.avatar) {
        await db.run(`UPDATE Usuario SET avatar = ? WHERE idUsuario = ?`, dados.avatar, idUsuario)
    }

    if (dados.telefone) {
        await db.run(`UPDATE Usuario SET telefone = ? WHERE idUsuario = ?`, dados.telefone, idUsuario)
    }

    if (dados.nome) {
        await db.run(`UPDATE Usuario SET nome = ? WHERE idUsuario = ?`, dados.nome, idUsuario)
    }

    await db.close()
    return 'Perfil atualizado com sucesso!'
}