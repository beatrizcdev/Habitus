import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Limpa as tabelas relacionadas (ordem importa por FK)
  await knex('Missao_Usuario').del();
  await knex('Missao').del();
  await knex('Recompensa').del();
  await knex('Item_Usuario').del();
  await knex('Item').del();

  // Insere itens (10 skins capibara + 3 badges)
  await knex('Item').insert([
    { tipo: 'skin', preco: 100, nome: 'Capibbara de Capa', descricao: 'Capibbara estilosa com capa.' },
    { tipo: 'skin', preco: 120, nome: 'Capibbara de Chapéu com Laço', descricao: 'Capibara elegante com chapéu e laço.' },
    { tipo: 'skin', preco: 110, nome: 'Capibbara de Bolsa', descricao: 'Capibara pronta para aventuras com bolsa.' },
    { tipo: 'skin', preco: 130, nome: 'Capibbara de Gravata', descricao: 'Capibara formal de gravata.' },
    { tipo: 'skin', preco: 115, nome: 'Capibbara de Chapéu', descricao: 'Capibara clássica de chapéu.' },
    { tipo: 'skin', preco: 140, nome: 'Capibbara Guia Turístico', descricao: 'Capibara pronta para te guiar.' },
    { tipo: 'skin', preco: 125, nome: 'Capibbara Dia das Mães', descricao: 'Capibara especial para o Dia das Mães.' },
    { tipo: 'skin', preco: 135, nome: 'Capibbara de Coroa', descricao: 'Capibara real com coroa.' },
    { tipo: 'skin', preco: 150, nome: 'Capibbara de Chapéu Colorido', descricao: 'Capibara divertida com chapéu colorido.' },
    { tipo: 'skin', preco: 90, nome: 'Capibbara Padrão', descricao: 'Capibara clássica e simpática.' },
    { tipo: 'badge', preco: 0, nome: 'Mestre de Tarefas', descricao: 'Conquistada por completar muitas tarefas.' },
    { tipo: 'badge', preco: 0, nome: 'Ancião Frequente', descricao: 'Conquistada por frequência exemplar.' },
    { tipo: 'badge', preco: 0, nome: 'Semente do Hábito', descricao: 'Conquistada ao iniciar sua jornada de hábitos.' },
  ]);

  // Insere recompensas 
  await knex('Recompensa').insert(
    Array.from({ length: 33 }, () => ({ origem: 'Missão' }))
  );

  // Insere 30 missões 
  await knex('Missao').insert([
    {
      nome: 'Desafio Inicial',
      descricao: 'Complete 1 tarefa para ganhar moedas.',
      meta: 1,
      tipo: 'tarefas',
      recompensa: 10,
      idRecompensa: null,
      dataLimite: null,
      dataInicio: null
    },
    {
      nome: 'Criador de Hábitos',
      descricao: 'Crie 3 hábitos novos.',
      meta: 3,
      tipo: 'habitos',
      recompensa: 20,
      idRecompensa: null,
      dataLimite: null,
      dataInicio: null
    },
    // Missões 3 a 12: skins capibara
    ...Array.from({ length: 10 }, (_, i) => ({
      nome: `Conquiste a Skin ${i + 1}`,
      descricao: `Complete tarefas para ganhar a skin Capibara ${i + 1}.`,
      meta: 5 + i,
      tipo: 'tarefas',
      recompensa: 0,
      idRecompensa: i + 1, // idItem 1 a 10 (ordem de inserção)
      dataLimite: null,
      dataInicio: null
    })),
    // Missões 13 a 15: badges
    {
      nome: 'Mestre de Tarefas',
      descricao: 'Complete 50 tarefas para ganhar o badge Mestre de Tarefas.',
      meta: 50,
      tipo: 'tarefas',
      recompensa: 0,
      idRecompensa: 11, // badge Mestre de Tarefas
      dataLimite: null,
      dataInicio: null
    },
    {
      nome: 'Ancião Frequente',
      descricao: 'Faça login por 10 dias para ganhar o badge Ancião Frequente.',
      meta: 10,
      tipo: 'login',
      recompensa: 0,
      idRecompensa: 12, // badge Ancião Frequente
      dataLimite: null,
      dataInicio: null
    },
    {
      nome: 'Semente do Hábito',
      descricao: 'Crie seu primeiro hábito para ganhar o badge Semente do Hábito.',
      meta: 1,
      tipo: 'habitos',
      recompensa: 0,
      idRecompensa: 13, // badge Semente do Hábito
      dataLimite: null,
      dataInicio: null
    },
    // Missões 16 a 30: moedas
    ...Array.from({ length: 15 }, (_, i) => ({
      nome: `Missão Extra ${i + 1}`,
      descricao: `Complete ${10 + i * 2} tarefas para ganhar moedas.`,
      meta: 10 + i * 2,
      tipo: 'tarefas',
      recompensa: 15 + i * 2,
      idRecompensa: null,
      dataLimite: null,
      dataInicio: null
    })),
  ]);
}