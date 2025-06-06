import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex('Usuario').whereIn('idUsuario', [2, 3]).del();
}

export async function down(knex: Knex): Promise<void> {
  // Não é possível restaurar os usuários deletados sem backup dos dados.
}