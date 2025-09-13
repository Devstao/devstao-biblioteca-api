const Livro = require('../models/Livro');
const Response = require('../utils/response')

const getAllLivros = async (filtros = {}) => {
    try {
        const livros = await Livro.findAll(filtros);
        return Response.success(livros, 200)
    }
    catch (err) {
        return Response.error(err.message);
    }
}

const getLivroById = async (id) => {
    try {
        const livro = await Livro.findById(id);
        if (!livro) {
            return Response.error('Livro não encontrado', 404);
        }
        return Response.success(livro, 200)
    }
    catch (err) {
        return Response.error(err.message);
    }
}

const createLivro = async (dadosLivro) => {
    try {
        const livro = await Livro.create(dadosLivro);
        return Response.success(livro, 201)
    }
    catch (err) {
        return Response.error(err.message);
    }
}

const updateLivro = async (dadosLivro, id) => {
    try {
        const livroExiste = await Livro.findById(id);

        if (!livroExiste) {
            return Response.error('Livro não encontrado', 404);
        }

        const livroAtualizado = await Livro.update(dadosLivro, id);
        return Response.success(livroAtualizado, 200)
    }
    catch (err) {
        return Response.error(err.message);
    }
}

const deleteLivro = async (id) => {
    try {
        const livroExiste = await Livro.findById(id);
        if (!livroExiste) {
            return Response.error('Livro não encontrado', 404);
        }

        await Livro.deleteRegister(id);
        return Response.success({ message: 'Livro excluído com sucesso' }, 200)
    }
    catch (err) {
        return Response.error(err.message);
    }
}

module.exports = {
    getAllLivros,
    getLivroById,
    createLivro,
    updateLivro,
    deleteLivro
}