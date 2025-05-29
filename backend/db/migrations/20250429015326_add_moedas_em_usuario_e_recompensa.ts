import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('Usuario', (table) => {
    table.integer('moedas').defaultTo(0);
  });

  await knex.schema.table('Recompensa', (table) => {
    table.integer('qtdMoedas').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('Usuario', (table) => {
    table.dropColumn('moedas');
  });

  await knex.schema.table('Recompensa', (table) => {
    table.dropColumn('qtdMoedas');
  });
}