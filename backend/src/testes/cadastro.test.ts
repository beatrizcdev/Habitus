import { cadastrarUsuario } from '../controladores/cadastro'
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'

beforeEach(async () => {
  await deletarDadosTeste()
})

afterEach(async () => {
  await deletarDadosTeste()
})

describe('Cadastro de Usuário', () => {
  const dadosValidos = {
    nome: 'Joselita Silva',
    senha: 'abc123',
    primeiroAcesso: '2025-05-01',
    telefone: '81999999999',
    nascimento: '2000-01-01',
    email: 'joselita@example.com',
    missoesFeitas: 0,
    diasSeguidos: 2,
    cpf: '11920008462',
    avatar: 'gato',
    corAvatar: 'azul',
    moedas: 10
  }

  it('deve cadastrar um usuário com dados válidos', async () => {
    const mensagem = await cadastrarUsuario(dadosValidos)
    expect(mensagem).toBe('Cadastro realizado com sucesso!')
  })

  it('deve rejeitar CPF já cadastrado', async () => {
    // Primeiro cadastro
    await cadastrarUsuario(dadosValidos)
      
    // Tentativa de segundo cadastro com mesmo CPF
    const dadosComMesmoCpf = {
        ...dadosValidos,
        email: 'outroemail@example.com'
    }
      
    await expect(cadastrarUsuario(dadosComMesmoCpf))
        .rejects
        .toThrow('CPF já Cadastrado.')
  })
})
