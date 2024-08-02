const { validationResult } = require("express-validator");
const centroService = require("../services/centroService");

// POST /centros - Adicionar um novo centro comunitário
async function adicionarCentro(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const novoCentro = await centroService.adicionarCentro(request.body);

    if (novoCentro) {
      return response.status(201).json(novoCentro);
    } else {
      return response
        .status(404)
        .json({ message: "Já existe um centro com esse nome" });
    }
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
}

// PUT /centros/:id/ocupacao - Atualizar ocupação de um centro comunitário
async function atualizarOcupacao(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const novaOcupacao = await centroService.atualizarOcupacao(
      request.params.id,
      request.body.quantidadeAtual
    );

    if (novaOcupacao) {
      response.status(200).json(novaOcupacao);
    } else {
      return response.status(404).json({ message: "Centro não encontrado" });
    }
  } catch (error) {
    await response.status(400).json({ message: error.message });
  }
}

// POST /centros/:id/intercambio - Realizar intercâmbio de recursos entre centros
async function realizarIntercambio(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const resultadoIntercambio = await centroService.realizarIntercambio(
      request.params.id,
      request.body
    );

    if (resultadoIntercambio) {
      return response.status(200).json(resultadoIntercambio);
    } else {
      return response
        .status(404)
        .json({ message: "Intercâmbio não realizado" });
    }
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
}

module.exports = {
  adicionarCentro,
  atualizarOcupacao,
  realizarIntercambio,
};
