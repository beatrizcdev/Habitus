import { ItemInventario } from "../modelos/itemInventario";
import { conectarBanco, conectarBancoTeste } from "../utilitarios/conexaoBD";

export async function comprarItem(idUsuario: number, idItem: number, equipar: boolean = false): Promise<string> {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    const item = await db.get(`SELECT * FROM Item WHERE idItem = ?`, [idItem])
    console.log(item)
    if (!item) {
        await db.close()
        throw new Error("Item não encontrado.")
    }

    //verifica se o usuario já possui o item
    const japossui = await db.get(`SELECT * FROM Item_Usuario WHERE idItem = ? AND idUsuario = ?`, [idItem, idUsuario])

    if(japossui){
        await db.close()
        throw new Error("Você já possui esse item")
    }

    //verifica as moedas do usuario
    const usuario = await db.get(`SELECT moedas FROM Usuario WHERE idUsuario = ?`, [idUsuario])

    if(!usuario || usuario.moedas < item.preco) {
        await db.close()
        throw new Error("Moedas insuficientes para comprar este item.")
    }

    //Desconta o valor do item
    await db.run(`UPDATE Usuario SET moedas = moedas - ? WHERE idUsuario = ?`, [item.preco, idUsuario])

    //inserindo o item no inventário
    await db.run(`
        INSERT INTO Item_Usuario (idItem, idUsuario, equipado, dataCompra)
        VALUES (?, ?, ?, Date('now'))`,
    [idItem, idUsuario, equipar ? "SIM" : "NÂO"])

    // Se for equipar, desequipa os outros

    if (equipar) {
        await db.run(`
            UPDATE Item_Usuario
            SET equipado = 'NÂO'
            WHERE idUsuario = ? AND idItem != ? AND equipado = 'SIM'`, [idUsuario, idItem])
    }

    await db.close()
    return equipar ? "Item comprado e equipado com sucesso!" : "Item comprado com sucesso!"
}

export async function listarInventario(idUsuario: number): Promise<ItemInventario[]> {
    
    const db = process.env.NODE_ENV === 'test'
    ? await conectarBancoTeste()
    : await conectarBanco()

    const itens = await db.all<ItemInventario[]>(`
        SELECT i.idItem, i.nome, i.tipo, i.descricao, i.preco, iu.equipado, iu.dataCompra FROM Item_Usuario iu
        JOIN Item i ON i.idItem = iu.idItem
        WHERE iu.idUsuario = ?`, [idUsuario])
    
    await db.close()
    return itens
}

export async function equiparItem(idUsuario: number, idItem: number) {
    const db = process.env.NODE_ENV === 'test'
        ? await conectarBancoTeste()
        : await conectarBanco();

    // Verifica se o item pertence ao usuário
    const itemUsuario = await db.get(`
        SELECT * FROM Item_Usuario WHERE idUsuario = ? AND idItem = ?
    `, [idUsuario, idItem]);

    if (!itemUsuario) {
        await db.close();
        throw new Error("Item não pertence ao usuário.");
    }

    // Verifica tipo do item
    const item = await db.get(`SELECT tipo FROM Item WHERE idItem = ?`, [idItem]);
    if (!item) {
        await db.close();
        throw new Error("Item não encontrado.");
    }

    if (item.tipo === 'skin') {
        // Desequipa todas as skins do usuário
        await db.run(`
            UPDATE Item_Usuario
            SET equipado = 'NÃO'
            WHERE idUsuario = ? AND idItem IN (
                SELECT idItem FROM Item WHERE tipo = 'skin'
            )
        `, [idUsuario]);
        // Equipa a skin escolhida
        await db.run(`
            UPDATE Item_Usuario
            SET equipado = 'SIM'
            WHERE idUsuario = ? AND idItem = ?
        `, [idUsuario, idItem]);
    } else if (item.tipo === 'badge') {
        // Apenas equipa o badge, sem desequipar outros badges
        await db.run(`
            UPDATE Item_Usuario
            SET equipado = 'SIM'
            WHERE idUsuario = ? AND idItem = ?
        `, [idUsuario, idItem]);
    } else {
        await db.close();
        throw new Error("Tipo de item não suportado para equipar.");
    }

    await db.close();
    return "Item equipado com sucesso.";
}

export async function listarItensLoja() {
    const db = process.env.NODE_ENV === 'test'
        ? await conectarBancoTeste()
        : await conectarBanco();

    // Busca todos os itens disponiveis pra compra
    const itens = await db.all(`
        SELECT idItem, nome, tipo, descricao, preco
        FROM Item
    `);

    await db.close();
    return itens;
}