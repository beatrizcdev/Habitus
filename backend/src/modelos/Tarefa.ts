export default class Tarefa{

    descricao: string
    status: string
    nome: string
    idUsuario: number
    prioridade?: string
    categoria?: string
    dataLimite?: string

    constructor( descricao: string, status: string = 'pendente', idUsuario: number, nome: string, prioridade?: string, categoria?: string, dataLimite?: string) {
        this.descricao = descricao
        this.status = status
        this.nome = nome
        this.idUsuario = idUsuario
        this.prioridade = prioridade
        this.categoria = categoria
        this.dataLimite = dataLimite
    }
}