import { loginUsuario } from '../controladores/login'
import { Database } from 'sqlite'
import bcrypt from 'bcrypt'
import { conectarBancoTeste } from '../utilitarios/conexaoBD'
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'

describe('Funcionalidade de Login com Banco Teste', () => {
    let db: Database

    // Cria uma conexão com o banco
    beforeEach(async () => {
        db = await conectarBancoTeste()
        //deleta dados do banco para impedir conflitos
        await deletarDadosTeste()
    })

    afterAll(async () => {
        //deleta dados do banco para impedir conflitos
        await deletarDadosTeste()
        await db.close()
    })

    it('deve realizar login com credenciais válidas', async () => {
        const emailOuCpf = 'usuario@exemplo.com'
        const senha = 'senha123'

        // Cria um usuário no banco de dados teste antes de testar
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        await db.run(
            `INSERT INTO Usuario (nome, senha, primeiroAcesso, telefone, nascimento, email, missoesFeitas, cpf, avatar, corAvatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                'Usuário Teste',
                senhaCriptografada,
                '2025-01-01',
                '123456789',
                '1990-01-01',
                emailOuCpf,
                0,
                '12345678902',
                'avatar.png',
                'azul',
            ]
        )

        // Testar o login
        const resultado = await loginUsuario(emailOuCpf, senha);
        expect(resultado.mensagem).toBe('Login realizado com sucesso!');
        expect(resultado.userId).toBeDefined();
    })

    it('não deve realizar login com e-mail/CPF inexistente', async () => {
        const emailOuCpf = 'nao-existe@exemplo.com'
        const senha = 'senhaQualquer'

        try {
            await loginUsuario(emailOuCpf, senha)
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe('Usuário não encontrado.')
            } else {
                throw error
            }
        }
    })

    it('não deve realizar login com senha incorreta', async () => {
        const emailOuCpf = 'usuario@exemplo.com'
        const senhaErrada = 'senhaErrada'

        // Cria um usuário no banco de dados antes de testar
        const senhaCriptografada = await bcrypt.hash('senha123', 10)
        await db.run(
            `INSERT INTO Usuario (nome, senha, primeiroAcesso, telefone, nascimento, email, missoesFeitas, cpf, avatar, corAvatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                'Usuário Teste',
                senhaCriptografada,
                '2025-01-01',
                '123456785',
                '1990-01-01',
                emailOuCpf,
                0,
                '1234567890',
                'avatar.png',
                'azul',
            ]
        )

        try {
            await loginUsuario(emailOuCpf, senhaErrada)
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe('Senha incorreta.')
            } else {
                throw error
            }
        }
    })
})
