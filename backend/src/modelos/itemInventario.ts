export interface ItemInventario {
  idItem: number
  nome: string
  tipo: string
  descricao?: string
  preco: number
  equipado: 'SIM' | 'NÃO'
  dataCompra: string
}