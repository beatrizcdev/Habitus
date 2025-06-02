import bcrypt from 'bcrypt'

export default class Usuario {
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

    constructor(nome: string, senhaHash: string, cpf: string, avatar: string, corAvatar: string, missoesFeitas: number, primeiroAcesso?: string, telefone?: string, nascimento?: string, email?: string, diasSeguidos?: number, moedas?: number) {
        this.nome = nome
        this.senha = senhaHash
        this.primeiroAcesso = primeiroAcesso
        this.telefone = telefone
        this.nascimento = nascimento
        this.email = email
        this.missoesFeitas = missoesFeitas
        this.cpf = cpf
        this.avatar = avatar
        this.corAvatar = corAvatar
        this.diasSeguidos = diasSeguidos
        this.moedas = moedas
    }

   // criptografia de senha
    public static async criarHash(senha: string): Promise<string> {
        return await bcrypt.hash(senha, 10)
    }

    // Método para verificar senha
    public static async verificarSenha(senha: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(senha, hash)
    }
}