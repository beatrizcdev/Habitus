import Usuario from "../modelos/Usuario"
import { conectarBanco, conectarBancoTeste } from '../utilitarios/conexaoBD'
import { validarCPF } from "../utilitarios/validacaoCpf"

export async function cadastrarUsuario(dados:{
    nome: string
    senha: string
    primeiroAcesso?: string
    telefone?: string 
    nascimento?: string
    email?: string
    missoesFeitas: number
    cpf: string
    avatar: string
    corAvatar: string
    diasSeguidos?: number
    moedas?: number
}): Promise<string> {

    // Validação do CPF
    if (!validarCPF(dados.cpf)) { 
        console.log("mensagem")
        throw new Error('CPF inválido. Por favor, insira um CPF válido com 11 dígitos.');
    }
    //validação de senha
    const senhaValida = /^(?=.*[a-zA-Z])(?=.*\d).{6}$/.test(dados.senha)
    if (!senhaValida) {
        throw new Error('A senha deve ser alfanumérica com exatamente 6 caracteres.')
    }

    //conectar com o banco
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    //verifica se o cpf já tá cadastrado
    const usuarioExistente = await db.get('SELECT * FROM Usuario WHERE cpf = ?', [dados.cpf])

    if (usuarioExistente){
        throw new Error('CPF já Cadastrado.')
    }

    // Verifica se o e-mail já está cadastrado
    if (dados.email) {
        const emailExistente = await db.get('SELECT * FROM Usuario WHERE email = ?', [dados.email]);
        if (emailExistente) {
            throw new Error('E-mail já cadastrado.');
        }
    }
        const senhaHash = await Usuario.criarHash(dados.senha)

        //criar instância da classe
        const usuario = new Usuario(
            dados.nome,
            senhaHash,
            dados.cpf,
            dados.avatar,
            dados.corAvatar,
            dados.missoesFeitas,
            dados.primeiroAcesso,
            dados.telefone,
            dados.nascimento,
            dados.email,
            dados.diasSeguidos,
            dados.moedas ?? 0
        )

        //inserir novo usuário no banco
        await db.run(
            `INSERT INTO Usuario
            (nome, senha, cpf, avatar, corAvatar, missoesFeitas, primeiroAcesso, telefone, nascimento, email, diasSeguidos, moedas)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
            usuario.nome,
            usuario.senha,
            usuario.cpf,
            usuario.avatar,
            usuario.corAvatar,
            usuario.missoesFeitas,
            usuario.primeiroAcesso,
            usuario.telefone,
            usuario.nascimento,
            usuario.email,
            usuario.diasSeguidos,
            usuario.moedas
            ]
        )

        // ...após inserir o usuário no banco...
        const usuarioCriado = await db.get('SELECT idUsuario FROM Usuario WHERE cpf = ?', [dados.cpf]);

        // Adiciona a Capibbara Padrão (idItem 10) já equipada
        await db.run(
          `INSERT INTO Item_Usuario (idItem, idUsuario, equipado, dataCompra)
           VALUES (?, ?, 'SIM', DATE('now'))`,
          [10, usuarioCriado.idUsuario]
        );

        await db.close()

        return 'Cadastro realizado com sucesso!'
    }

