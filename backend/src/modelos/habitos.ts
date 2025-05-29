export default class Habito{

    idUsuario: number
    nome: string
    status: string
    descricao: string

    constructor (idUsuario: number, nome: string, status: string, descricao: string) {
        this.idUsuario = idUsuario
        this.nome = nome
        this.status = status
        this.descricao = descricao
    }
}