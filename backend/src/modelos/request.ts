import { Request } from 'express'

export interface RequestComUsuario extends Request {
  usuario?: {
    idUsuario: number
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
  }
}