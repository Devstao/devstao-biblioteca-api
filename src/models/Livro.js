const categoriasEnum = require('../utils/enums/categoriasEnum');
const db = require('../config/database');

// Busca todos os livros do banco de dados
// Pode receber filtros como parâmetro para pesquisa personalizada
const findAll = async (filtros = {}) => {
    let query = `
        SELECT l.*,
            COUNT(v.id) as total_votos,
            COALESCE(AVG(v.nota), 0) as media_votos
        FROM livros l
        LEFT JOIN votacoes v ON v.livro_id = l.id
        WHERE l.deleted_at IS NULL
        `;

    const params = [];

    // Se titulo, nome_autor e descricao estiverem todos preenchidos, faz busca geral nos três campos
    if (filtros.titulo && filtros.nome_autor && filtros.descricao) {
        const termoGeral = `%${filtros.titulo}%`;
        query += ' AND (titulo LIKE ? OR nome_autor LIKE ? OR descricao LIKE ?)';
        params.push(termoGeral, termoGeral, termoGeral);
    } else {
        // Caso contrário, aplica filtros individuais normalmente
        if (filtros.titulo) {
            query += ' AND titulo LIKE ?';
            params.push(`%${filtros.titulo}%`);
        }

        if (filtros.nome_autor) {
            query += ' AND nome_autor LIKE ?';
            params.push(`%${filtros.nome_autor}%`);
        }

        if (filtros.descricao) {
            query += ' AND descricao LIKE ?';
            params.push(`%${filtros.descricao}%`);
        }
    }

    if (filtros.order_by_counts) {
        query += ' ORDER BY visitas_count DESC';
    }

    if (filtros.categoria) {
        query += ' AND categoria = ?';
        params.push(filtros.categoria);
    }

    query += ' GROUP BY l.id';

    const [livros] = await db.execute(query, params);
    return livros;
}

// Busca um livro específico pelo ID
const findById = async (id, userId) => {
    const query = `
        SELECT l.*,
            COUNT(v.id) as total_votos,
            COALESCE(AVG(v.nota), 0) as media_votos,
            COALESCE((SELECT v2.id FROM votacoes v2 WHERE v2.livro_id = l.id AND v2.usuario_id = ? LIMIT 1), 0) as votacao_id,
            u.nome as usuario_nome
        FROM livros l
        LEFT JOIN votacoes v ON v.livro_id = l.id
        LEFT JOIN users u ON u.id = l.usuario_id 
        WHERE l.id = ? AND l.deleted_at IS NULL
        GROUP BY l.id
    `;
    const params = [userId || null, id];
    const [livros] = await db.execute(query, params);
    return livros[0];
}

// Cria um novo registro de livro no banco de dados
const create = async (request) => {
    let categoriaTratada = request.categoria || 'outros';
    if (!categoriasEnum.includes(categoriaTratada)) {
        categoriaTratada = 'outros';
    }

    const query = `
        INSERT INTO livros (
            titulo, nome_autor, descricao, isbn, edicao, ano_publicacao,
            editor, arquivo_url, capa_url, usuario_id, categoria
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        request.titulo || null,
        request.nome_autor || null,
        request.descricao || null,
        request.isbn || null,
        request.edicao || null,
        request.ano_publicacao || null,
        request.editor || null,
        request.arquivo_url || null,
        request.capa_url || null,
        request.user_id || null,
        categoriaTratada,
    ];

    const [result] = await db.execute(query, params);
    return findById(result.insertId);
};

// Atualiza os dados de um livro existente
const update = async (request, id) => {
    let setClause = [];
    let params = [];

    // Aqui faremos diversos testes para verificar se os parâmetros estão vazios ou não
    // Por que faremos isso? Para não remover um campo preenchido com uma condição nula, exemplo:
    // request.isbn é null, mas no banco de dados esta preenchido
    // se jogarmos isso sem tratar, iremos remover a informação do banco
    if (request.titulo != undefined || request.titulo) {
        setClause.push('titulo = ?');
        params.push(request.titulo);
    }
    if (request.nome_autor != undefined || request.nome_autor) {
        setClause.push('nome_autor = ?');
        params.push(request.nome_autor);
    }
    if (request.descricao != undefined || request.descricao) {
        setClause.push('descricao = ?');
        params.push(request.descricao);
    }
    if (request.isbn != undefined || request.isbn) {
        setClause.push('isbn = ?');
        params.push(request.isbn);
    }
    if (request.edicao != undefined || request.edicao) {
        setClause.push('edicao = ?');
        params.push(request.edicao);
    }
    if (request.ano_publicacao != undefined || request.ano_publicacao) {
        setClause.push('ano_publicacao = ?');
        params.push(request.ano_publicacao);
    }
    if (request.editor != undefined || request.editor) {
        setClause.push('editor = ?');
        params.push(request.editor);
    }
    if (request.arquivo_url != undefined || request.arquivo_url) {
        setClause.push('arquivo_url = ?');
        params.push(request.arquivo_url);
    }
    if (request.capa_url != undefined || request.capa_url) {
        setClause.push('capa_url = ?');
        params.push(request.capa_url);
    }
    if (request.categoria) {
        const categoriaTratada = categoriasEnum.includes(request.categoria)
            ? request.categoria
            : 'outros';
        setClause.push('categoria = ?');
        params.push(categoriaTratada);
    }

    // Caso não tenha nada para atualizar, iremos fazer um "early return"
    // Um "retorno antecipado" é uma técnica de retornar antes de realizar uma ação que demande mais processamento
    // Assim você evita de puxar mais processamento do que fato é necessário
    // Também há a questão da legibilidade do código, para que não haja ninhos de if/else dentro do código
    // Deixando o código mais fácil de ler
    if (setClause.length === 0) {
        return findById(id);
    }


    params.push(id);

    const query = `
        UPDATE livros 
        SET ${setClause.join(', ')}
        WHERE id = ? AND deleted_at IS NULL
    `;

    await db.execute(query, params);
    return findById(id);
}

// Realiza uma exclusão lógica do livro (soft delete)
// Podemos reativa-lo depois se necessário
const deleteRegister = async (id) => {
    const query = 'UPDATE livros SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL';
    await db.execute(query, [id]);
    return { id };
}

const incrementViewCount = async (id) => {
    const query = 'UPDATE livros SET visitas_count = visitas_count + 1 WHERE id = ? AND deleted_at IS NULL';
    await db.execute(query, [id]);
    return findById(id);
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteRegister,
    incrementViewCount
}

