import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'
import Usuario from '../modelos/Usuario'


export async function loginUsuario(emailOuCpf: string, senha: string): Promise<{mensagem: string, userId: number}> {
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()
    //verifica se o email ou cpf existe no banco de dados
    const usuario = await db.get('SELECT * FROM Usuario WHERE email = ? OR cpf = ?', [emailOuCpf, emailOuCpf])

    if(!usuario) {
        throw new Error('Usuário não encontrado.')
    }

    console.log('Usuário encontrado:', usuario)
    console.log('Hash armazenado:', usuario.senha)

    //verificação de senha
    const senhaValida = await Usuario.verificarSenha(senha, usuario.senha)
    console.log('Resultado da comparação:', senhaValida)

    if(!senhaValida) {
        throw new Error('Senha incorreta.')
    }

    await db.close()
    return {
        mensagem: 'Login realizado com sucesso!',
        userId: usuario.idUsuario
    }
}