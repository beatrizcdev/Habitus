import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('Usuario').where({ idUsuario: 4 }).del();
}

export async function down(knex: Knex): Promise<void> {
  // Não há como desfazer uma exclusão específica com segurança,
  // mas você poderia adicionar lógica de restauração se quiser.
}