import { validationResult } from "express-validator";
const relatorioService = require("../services/relatorioService");

// GET /relatorios/ocupacao - Relatório de centros com ocupação maior que 90%
export async function relatorioOcupacao(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const relatorio = await relatorioService.relatorioOcupacao(
      request.dataInicio,
      request.dataFim
    );

    return response.status(200).json(relatorio);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}

// GET /relatorios/recursos - Quantidade média de cada tipo de recurso
export async function relatorioRecursos(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const relatorio = await relatorioService.relatorioRecursos(
      request.centroId,
      request.tipo
    );

    return response.status(200).json(relatorio);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}

// GET /relatorios/negociacoes - Histórico de negociações, com filtros
export async function relatorioIntercambio(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const relatorio = await relatorioService.relatorioIntercambio(
      request.dataInicio,
      request.dataFim,
      request.centroId
    );

    return response.status(200).json(relatorio);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}
