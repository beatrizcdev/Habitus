import knex, { Knex } from "knex"

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './db/app.db',
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    },
    seeds: {
        extension: 'ts',
        directory: './db/seeds',
    },
}

const db = knex(config)

export default db