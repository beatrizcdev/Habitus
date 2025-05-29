import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Limpar tabelas
  await knex('Usuario_Noticia').del();
  await knex('Item_Usuario').del();
  await knex('Missao_Usuario').del();
  await knex('Usuario_Recompensa').del();
  await knex('Usuario').del();
  await knex('Noticia').del();
  await knex('Notificacao').del();
  await knex('Amizade').del();
  await knex('Tarefa').del();
  await knex('Habito').del();
  await knex('Recompensa').del();
  await knex('Item').del();
  await knex('Missao').del();

  // Inserir usuários
  await knex('Usuario').insert([
    {
      nome: 'Maria Silva',
      senha: 'senha123',
      primeiroAcesso: '2025-04-28',
      telefone: '81999990000',
      nascimento: '2000-01-01',
      email: 'maria@email.com',
      missoesFeitas: 0,
      cpf: '12345678901',
      avatar: 'padrão',
      corAvatar: 'azul',
      moedas: 50,
    },
    {
      nome: 'João Santos',
      senha: 'senha456',
      primeiroAcesso: '2025-03-25',
      telefone: '81988880000',
      nascimento: '1999-06-15',
      email: 'joao@email.com',
      missoesFeitas: 0,
      cpf: '98765432100',
      avatar: 'padrão',
      corAvatar: 'verde',
      moedas: 150,
    },
    {
      nome: 'Ana Beatriz',
      senha: 'senha789',
      primeiroAcesso: '2025-04-29',
      telefone: '81977770000',
      nascimento: '2022-03-21',
      email: 'bia@email.com',
      missoesFeitas: 1,
      cpf: '11122233344',
      avatar: 'padrão',
      corAvatar: 'bege',
      moedas: 20,
    },
    {
      nome: 'Carlos Mendes',
      senha: 'senha321',
      primeiroAcesso: '2025-02-02',
      telefone: '81966660000',
      nascimento: '1995-11-10',
      email: 'carlos@email.com',
      missoesFeitas: 2,
      cpf: '44455566677',
      avatar: 'padrão',
      corAvatar: 'marrom',
      moedas: 30,
    },
  ]);

  // Inserir missões
  await knex('Missao').insert([
    { descricao: 'Completar 10 tarefas', dataLimite: null, dataInicio: null, nome: 'Desafio Inicial' },
    { descricao: 'Criar um novo hábito', dataLimite: null, dataInicio: null, nome: 'Desafio Hábito' },
    { descricao: 'Manter 7 dias de streak', dataLimite: null, dataInicio: null, nome: 'Streak Semanal' },
    { descricao: 'Completar 5 tarefas pessoais', dataLimite: null, dataInicio: null, nome: 'Autocuidado' },
  ]);

  // Inserir itens
  await knex('Item').insert([
    { tipo: 'Chapéu', preco: 50, nome: 'Chapéu Azul', descricao: 'Um belo chapéu azul para o avatar.' },
    { tipo: 'Camisa', preco: 70, nome: 'Camisa Verde', descricao: 'Camisa para aventuras.' },
    { tipo: 'Botas', preco: 80, nome: 'Botas Marrons', descricao: 'Botas resistentes para desafios.' },
    { tipo: 'Óculos', preco: 40, nome: 'Óculos Estilosos', descricao: 'Melhore o visual do seu avatar.' },
  ]);

  // Inserir recompensas
  await knex('Recompensa').insert([
    { origem: 'Missão' , qtdMoedas: 10},
    { origem: 'Loja' , qtdMoedas: 30},
    { origem: 'Conquista' , qtdMoedas: 45},
    { origem: 'Evento' , qtdMoedas: 60},
  ]);

  // Inserir hábitos
  await knex('Habito').insert([
    { idUsuario: 1, nome: 'Ler 10 páginas por dia', status: 'ativo', descricao: 'Ler todos os dias para crescimento pessoal.' },
    { idUsuario: 2, nome: 'Beber 2L de água', status: 'ativo', descricao: 'Manter a hidratação em dia.' },
    { idUsuario: 3, nome: 'Meditar por 10 minutos', status: 'ativo', descricao: 'Relaxar e focar a mente.' },
    { idUsuario: 4, nome: 'Evitar redes sociais pela manhã', status: 'ativo', descricao: 'Começar o dia com foco.' },
  ]);

  // Inserir tarefas
  await knex('Tarefa').insert([
    { descricao: 'Finalizar o relatório', status: 'pendente', idUsuario: 1, nome: 'Relatório', prioridade: 'Alta', categoria: 'Trabalho', dataLimite: '2025-05-01' },
    { descricao: 'Comprar presentes', status: 'pendente', idUsuario: 2, nome: 'Presentes', prioridade: 'Média', categoria: 'Pessoal', dataLimite: '2025-05-02' },
    { descricao: 'Estudar SQL', status: 'pendente', idUsuario: 3, nome: 'SQL',  prioridade: 'Alta', categoria: 'Estudos', dataLimite: '2025-05-03' },
    { descricao: 'Agendar consulta médica', status: 'concluída', idUsuario: 4, nome: 'consulta', prioridade: 'Baixa', categoria: 'Saúde', dataLimite: '2025-04-30' },
  ]);

  // Inserir amizades
  await knex('Amizade').insert([
    { idUsuario1: 1, idUsuario2: 2, status: 'aceito', dataAmizade: '2025-04-28' },
    { idUsuario1: 1, idUsuario2: 3, status: 'aceito', dataAmizade: '2025-04-29' },
    { idUsuario1: 2, idUsuario2: 4, status: 'pendente', dataAmizade: '2025-04-25' },
  ]);

  // Inserir notificações
  await knex('Notificacao').insert([
    { idUsuario: 1, mensagem: 'Você ganhou uma nova recompensa!', dataEnvio: '2025-04-28', tipo: 'Sistema', lida: 0 },
    { idUsuario: 2, mensagem: 'Você recebeu uma nova missão!', dataEnvio: '2025-05-25', tipo: 'Sistema', lida: 0 },
    { idUsuario: 3, mensagem: 'Você concluiu seu hábito por 5 dias!', dataEnvio: '2025-05-30', tipo: 'Hábito', lida: 0 },
    { idUsuario: 4, mensagem: 'Item novo na loja!', dataEnvio: '2025-05-01', tipo: 'Loja', lida: 0 },
  ]);

  // Inserir notícias
  await knex('Noticia').insert([
    { id_noticia: 1, dataPublicacao: '2025-06-12', resumo: 'O dólar caiu para R$ 5,20' },
    { id_noticia: 2, dataPublicacao: '2025-04-29', resumo: 'Mudança na declaração de impostos!' },
  ]);

  // Relacionar usuários com notícias
  await knex('Usuario_Noticia').insert([
    { idUsuario: 1, idNoticia: 1, resumo: 'O dólar caiu para R$ 5,20' },
    { idUsuario: 2, idNoticia: 2, resumo: 'Mudança na declaração de impostos!' },
  ]);

  // Relacionar missões com usuários
  await knex('Missao_Usuario').insert([
    { idMissao: 1, idUsuario: 1, statusMissao: 'em andamento' },
    { idMissao: 2, idUsuario: 2, statusMissao: 'pendente' },
    { idMissao: 3, idUsuario: 3, statusMissao: 'concluída' },
    { idMissao: 4, idUsuario: 4, statusMissao: 'em andamento' },
  ]);

  // Relacionar itens com usuários
  await knex('Item_Usuario').insert([
    { idItem: 1, idUsuario: 1, equipado: 'sim', dataCompra: '2025-05-01' },
    { idItem: 2, idUsuario: 2, equipado: 'não', dataCompra: '2025-05-28' },
    { idItem: 3, idUsuario: 3, equipado: 'sim', dataCompra: '2025-04-30' },
    { idItem: 4, idUsuario: 4, equipado: 'não', dataCompra: '2025-05-02' },
  ]);

  // Relacionar recompensas com usuários
  await knex('Usuario_Recompensa').insert([
    { idUsuario: 1, idRecompensa: 1, tipoRecompensa: 'Badge' },
    { idUsuario: 2, idRecompensa: 2, tipoRecompensa: 'item' },
    { idUsuario: 3, idRecompensa: 3, tipoRecompensa: 'Badge' },
    { idUsuario: 4, idRecompensa: 4, tipoRecompensa: 'item' },
  ]);
};
