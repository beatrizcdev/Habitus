import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Limpa as tabelas relacionadas (ordem importa por FK)
  await knex('Missao_Usuario').del();
  await knex('Missao').del();
  await knex('Recompensa').del();
  await knex('Item_Usuario').del();
  await knex('Item').del();

  // Insere itens (para recompensas de missão)
  await knex('Item').insert([
    { idItem: 1, tipo: 'Chapéu', preco: 50, nome: 'Chapéu Azul', descricao: 'Um belo chapéu azul para o avatar.' },
    { idItem: 2, tipo: 'Camisa', preco: 70, nome: 'Camisa Verde', descricao: 'Camisa para aventuras.' },
    { idItem: 3, tipo: 'Botas', preco: 80, nome: 'Botas Marrons', descricao: 'Botas resistentes para desafios.' },
    { idItem: 4, tipo: 'Óculos', preco: 40, nome: 'Óculos Estilosos', descricao: 'Melhore o visual do seu avatar.' },
  ]);

  // Insere recompensas (moedas ou itens)
  await knex('Recompensa').insert([
    { idRecompensa: 1, origem: 'Missão', qtdMoedas: 10 },
    { idRecompensa: 2, origem: 'Missão', qtdMoedas: 20 },
    { idRecompensa: 3, origem: 'Missão', qtdMoedas: 0 }, // Para missão que dá item
    { idRecompensa: 4, origem: 'Missão', qtdMoedas: 0 }, // Para missão que dá item
  ]);

  // Insere missões (algumas com recompensa em moedas, outras com item)
  await knex('Missao').insert([
    {
      idMissao: 1,
      nome: 'Desafio Inicial',
      descricao: 'Complete 3 tarefas para ganhar moedas.',
      meta: 3,
      tipo: 'tarefas',
      recompensa: 10,
      idRecompensa: 1,
      dataLimite: null,
      dataInicio: null
    },
    {
      idMissao: 2,
      nome: 'Criador de Hábitos',
      descricao: 'Crie 3 hábitos novos.',
      meta: 3,
      tipo: 'habitos',
      recompensa: 20,
      idRecompensa: 2,
      dataLimite: null,
      dataInicio: null
    },
    {
      idMissao: 3,
      nome: 'Ganhe um Chapéu',
      descricao: 'Conclua 5 tarefas em uma semana e ganhe um chapéu exclusivo.',
      meta: 5,
      tipo: 'tarefas',
      recompensa: 0,
      idRecompensa: 1, // idItem 1 = Chapéu Azul
      dataLimite: null,
      dataInicio: null
    },
    {
      idMissao: 4,
      nome: 'Streak Semanal',
      descricao: 'Mantenha 7 dias de streak.',
      meta: 7,
      tipo: 'streak',
      recompensa: 0,
      idRecompensa: 2, // idItem 2 = Camisa Verde
      dataLimite: null,
      dataInicio: null
    }
  ]);

}