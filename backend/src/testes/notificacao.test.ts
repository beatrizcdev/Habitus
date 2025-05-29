import { enviarNotificacao } from '../controladores/notificacoes'
import { conectarBancoTeste } from '../utilitarios/conexaoBD'
import { deletarDadosTeste } from '../utilitarios/deletarDadosTestes'


describe('Funcionalidade de Notificações', () => {

    beforeAll(async () => {
        deletarDadosTeste()
    })

    afterAll(async () => {
        deletarDadosTeste()
    })
    it('deve enviar e salvar uma notificação corretamente no banco de dados', async () =>{

        const db = await conectarBancoTeste()

        //criar usuário teste
        const resultadoUsuario = await db.run(`
            INSERT INTO Usuario (nome, senha, cpf, moedas)
            VALUES ('Usuario Notificação', 'abc123', '99999999999', 0) `
        )
        
        const idUsuario = resultadoUsuario.lastID

        //envia a notificação
        const mensagem = 'Teste de notificação'
        const tipo = 'teste'
        await enviarNotificacao(Number(idUsuario), mensagem, tipo)

        //busca a notificação salva
        const notificacao = await db.get(`
            SELECT * FROM Notificacao WHERE idUsuario = ? ORDER BY idNotificacao DESC LIMIT 1`, [idUsuario]
        )
        
        expect(notificacao).toBeDefined()
        expect(notificacao.idUsuario).toBe(idUsuario)
        expect(notificacao.mensagem).toBe(mensagem)
        expect(notificacao.tipo).toBe(tipo)
        expect(notificacao.lida).toBe(0)
        // Verificar o formato da data
        expect(notificacao.dataEnvio).toMatch(/^\d{4}-\d{2}-\d{2}$/) 

        await db.close()
    })
})