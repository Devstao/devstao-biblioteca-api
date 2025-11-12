const livroService = require('../services/livroServices');

const getLivros = async (req, res) => {
    const filtros = req.query;
    try {
        const result = await livroService.getAllLivros(filtros)
        if (result.success) {
            return res.status(200).json(result.data)
        }
        return res.status(500).json({ error: result.error });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
}

const getLivroById = async (req, res) => {
    const filtros = req.params;
    const userId = req.user.id;
    try {
        const result = await livroService.getLivroById(filtros.id, userId)
        if (result.success) {
            return res.status(200).json(result.data)
        }
        return res.status(500).json({ error: result.error });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
}

const createLivro = async (req, res) => {
    try {
        const {
            titulo,
            nome_autor,
            descricao,
            editora,
            ano_publicacao,
            isbn,
            edicao,
            local_publicacao,
            exemplar,
            categoria
        } = req.body;

        const userId = req.user.id;
        const arquivoLivro = req.files?.arquivo_livro?.[0] || null;
        const capa = req.files?.capa?.[0] || null;

        if (!titulo || !nome_autor) {
            return res.status(400).json({ error: 'Título e nome do autor são obrigatórios.' });
        }
        if (!arquivoLivro) {
            return res.status(400).json({ error: 'Arquivo do livro é obrigatório.' });
        }

        const params = {
            titulo,
            nome_autor,
            descricao,
            editora,
            ano_publicacao: ano_publicacao ? Number(ano_publicacao) : undefined,
            isbn,
            edicao,
            local_publicacao,
            exemplar,
            categoria,
            arquivo_url: `${process.env.BASE_URL}/uploads/${arquivoLivro.filename}`,
            capa_url: capa ? `${process.env.BASE_URL}/uploads/${capa.filename}` : null,
            user_id: userId,
        };

        const result = await livroService.createLivro(params);

        if (result.success) return res.status(201).json(result.data);
        return res.status(500).json({ error: result.error });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const updateLivro = async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    try {
        const result = await livroService.updateLivro(dados, id)
        if (result.success) {
            return res.status(200).json(result.data)
        }
        return res.status(500).json({ error: result.error });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
}

const deleteLivro = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await livroService.deleteLivro({ id })
        if (result.success) {
            return res.status(204).send()
        }
        return res.status(500).json({ error: result.error });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
}

const countView = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
    }

    try {
        const result = await livroService.countView(id);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(500).json({ error: result.error });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = {
    getLivros,
    getLivroById,
    createLivro,
    updateLivro,
    deleteLivro,
    countView
};