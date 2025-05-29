import { conectarBancoTeste } from '../utilitarios/conexaoBD'

describe('Testando Conexão com o Banco de Dados', () => {
    it('Deve conectar corretamente ao banco de dados', async () => {
        const db = await conectarBancoTeste()

        const result = await db.get('SELECT 1 AS result')
        expect(result.result).toBe(1)  // Verifica se a consulta retornou 1

        await db.close()
    })
})
