import knex, { Knex } from "knex"

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './backend/db/app.db',
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './backend/db/migrations',
    },
    seeds: {
        extension: 'ts',
        directory: './backend/db/seeds',
    },
}

const db = knex(config)

export default db