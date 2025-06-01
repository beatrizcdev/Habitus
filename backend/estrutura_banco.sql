CREATE TABLE "main"."Usuario" (
  "idUsuario" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "nome" TEXT(50) NOT NULL,
  "senha" TEXT NOT NULL,
  "primeiroAcesso" TEXT(10),
  "telefone" TEXT(15),
  "nascimento" TEXT(10),
  "email" TEXT(50),
  "missoesFeitas" integer,
  "cpf" text(11) NOT NULL,
  "avatar" text(20),
  "corAvatar" TEXT(10),
  "diasSeguidos" integer DEFAULT 0,
  CONSTRAINT "fk_Usuario_Usuario_Noticia" FOREIGN KEY ("idUsuario") REFERENCES "Usuario_Noticia" ("idUsuario"),
  CONSTRAINT "id_unique_constraints" UNIQUE ("idUsuario"),
  CONSTRAINT "cpf_unique_constraints" UNIQUE ("cpf"),
  CONSTRAINT "email_unique_constraints" UNIQUE ("email")
);

CREATE TABLE "main"."Amizade" (
  "idUsuario1" integer NOT NULL,
  "idUsuario2" integer NOT NULL,
  "status" TEXT(10),
  "dataAmizade" TEXT(10),
  PRIMARY KEY ("idUsuario1", "idUsuario2"),
  CONSTRAINT "fk_Amizade_Usuario_1" FOREIGN KEY ("idUsuario1") REFERENCES "Usuario" ("idUsuario"),
  CONSTRAINT "fk_Amizade_Usuario_2" FOREIGN KEY ("idUsuario2") REFERENCES "Usuario" ("idUsuario")
);

CREATE TABLE "main"."Missao" (
  "idMissao" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "descricao" TEXT(100) NOT NULL,
  "meta" integer NOT NULL,
  "tipo" TEXT NOT NULL,
  "recompensa" integer NOT NULL,
  "idRecompensa" integer,
  "dataLimite" TEXT(10),
  "dataInicio" TEXT(10),
  "nome" TEXT(50) NOT NULL,
  CONSTRAINT "id_unique_constraints" UNIQUE ("idMissao")
);

CREATE TABLE "main"."Missao_Usuario" (
  "idMissao" integer NOT NULL,
  "idUsuario" integer NOT NULL,
  "statusMissao" TEXT(10),
  PRIMARY KEY ("idMissao", "idUsuario"),
  CONSTRAINT "fk_Missao_Usuario_Missao" FOREIGN KEY ("idMissao") REFERENCES "Missao" ("idMissao"),
  CONSTRAINT "fk_Missao_Usuario_Usuario" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario")
);

CREATE TABLE "Notificacao" (
  "idNotificacao" INTEGER PRIMARY KEY AUTOINCREMENT,
  "idUsuario" INTEGER NOT NULL,
  "mensagem" TEXT(50) NOT NULL,
  "dataEnvio" TEXT(10) NOT NULL,
  "tipo" TEXT(10),
  "lida" BOOLEAN DEFAULT 0,
  CONSTRAINT "fk_Notificacao_Usuario" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario"),
  CONSTRAINT "id_unique_constraint" UNIQUE ("idNotificacao")
);

CREATE TABLE "main"."Usuario_Noticia" (
  "idUsuario" integer NOT NULL,
  "idNoticia" integer NOT NULL,
  "resumo" TEXT(100) NOT NULL,
  PRIMARY KEY ("idUsuario", "idNoticia"),
  CONSTRAINT "idUsuario" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario"),
  CONSTRAINT "fk_Usuario_Noticia_Noticia" FOREIGN KEY ("idNoticia") REFERENCES "Noticia" ("id_noticia")
);

CREATE TABLE "main"."Noticia" (
  "id_noticia" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "dataPublicacao" text,
  "resumo" text,
  CONSTRAINT "id_unique_constraints" UNIQUE ("id_noticia")
);

CREATE TABLE "main"."Usuario_Recompensa" (
  "idUsuario" integer NOT NULL,
  "idRecompensa" integer NOT NULL,
  "tipoRecompensa" TEXT(10),
  PRIMARY KEY ("idRecompensa", "idUsuario"),
  CONSTRAINT "fk_Usuario_Recompensa_Usuario" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario"),
  CONSTRAINT "fk_Usuario_Recompensa_Recompensa" FOREIGN KEY ("idRecompensa") REFERENCES "Recompensa" ("idRecompensa")
);

CREATE TABLE "main"."tarefa" (
  "idTarefa" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "descricao" TEXT(50) NOT NULL,
  "nome" TEXT(50) NOT NULL,
  "status" TEXT(10) DEFAULT 'pendente',
  "idUsuario" integer NOT NULL,
  "prioridade" TEXT(10),
  "categoria" TEXT(10),
  "dataLimite" text(10),
  CONSTRAINT "fk_tarefa_Usuario" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario"),
  CONSTRAINT "id_unique_constraints" UNIQUE ("idTarefa")
);

CREATE TABLE "main"."Habito" (
  "idHabito" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "idUsuario" integer NOT NULL,
  "nome" TEXT(50) NOT NULL,
  "status" TEXT(10) NOT NULL,
  "descricao" TEXT(100),
  CONSTRAINT "fk_Habito_Usuario" FOREIGN KEY ("idHabito") REFERENCES "Usuario" ("idUsuario"),
  CONSTRAINT "id_unique_constraint" UNIQUE ("idHabito")
);

CREATE TABLE "main"."Recompensa" (
  "idRecompensa" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "origem" TEXT(10),
  CONSTRAINT "id_unique_constraint" UNIQUE ("idRecompensa")
);

CREATE TABLE "main"."Item_Usuario" (
  "idItem" integer NOT NULL,
  "idUsuario" integer NOT NULL,
  "equipado" TEXT(3) DEFAULT 'NÃO',
  "dataCompra" TEXT(10),
  PRIMARY KEY ("idItem", "idUsuario"),
  CONSTRAINT "fk_Item_Usuario_Item" FOREIGN KEY ("idItem") REFERENCES "Item" ("idItem"),
  CONSTRAINT "fk_Item_Usuario_Usuario" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario")
);

CREATE TABLE "main"."Item" (
  "idItem" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "tipo" TEXT(50) NOT NULL,
  "preco" integer(20) NOT NULL,
  "nome" TEXT(50) NOT NULL,
  "descricao" TEXT(100),
  CONSTRAINT "id_unique_constraints" UNIQUE ("idItem")
);

CREATE TRIGGER atribuir_missoes_ao_criar_usuario
AFTER INSERT ON Usuario
BEGIN
  INSERT INTO Missao_Usuario (idMissao, idUsuario, statusMissao)
  SELECT idMissao, NEW.idUsuario, 'pendente' FROM Missao;
END;

CREATE TRIGGER atribuir_missao_para_todos_os_usuarios
AFTER INSERT ON Missao
BEGIN
  INSERT INTO Missao_Usuario (idMissao, idUsuario, statusMissao)
  SELECT NEW.idMissao, idUsuario, 'pendente' FROM Usuario;
END;