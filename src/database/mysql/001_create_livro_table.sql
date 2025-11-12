-- O correto mesmo seria iniciar com a tabela de usuários
-- Por que boa parte das interações do sistema irá partir deles e terá ligação com eles
-- Porém como quero fazer um exemplo com livros primeiro, estou deixando dessa forma
-- Essa é a v1 da tabela, iremos adicionar outras informações ao longo do projeto
CREATE TABLE livros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  nome_autor VARCHAR(255) NULL,
  descricao TEXT NULL,
  isbn varchar(100) NULL,
  edicao varchar(100) NULL,
  ano_publicacao INT NULL,
  editor VARCHAR(255) NULL,
  arquivo_url VARCHAR(500) NULL,
  capa_url VARCHAR(500) NULL,
  categoria varchar(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  usuario_id INT NOT NULL -- TODO: Criar um alter table para adicioanr constraint de usuarios
  -- FOREIGN KEY (usuario_id) REFERENCES usuarios(id) -- TODO: Adicionar futuramente
);