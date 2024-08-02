import negociacao from "../models/negociacao";
import centroComunitario from "../models/centroComunitario";
import { existCentro, existNegociacao } from "../utils/validation";

export async function relatorioOcupacao(dataInicio, dataFim) {
  try {
    const filtro = {};

    //Filtrar por datas
    if (dataInicio) {
      filtro["dataCriacao"] = {
        ...filtro["dataCriacao"],
        $gte: new Date(inicio),
      };
    }
    if (dataFim) {
      filtro["dataCriacao"] = { ...filtro["dataCriacao"], $lte: new Date(fim) };
    }

    // Obtenha os centros e calculando o total
    const centros = await centroComunitario.find(filtro);

    const totalCapacidade = centros.reduce(
      (acc, centro) => acc + centro.capacidadeMaxima,
      0
    );
    const totalAtual = centros.reduce(
      (acc, centro) => acc + centro.quantidadeAtual,
      0
    );

    return {
      totalCapacidade,
      totalAtual,
    };
  } catch (error) {
    throw new Error(
      `Erro ao obter relatório de centros com ocupação acima de 90%: ${error.message}`
    );
  }
}
export async function relatorioRecursos(centroId, tipo) {
  try {
    const exist = existCentro(centroId);
    if (!centro) {
      throw new Error("Centro não encontrado");
    }

    const recursos = centro.recursos.filter(
      (recurso) => !tipo || recurso.tipo === tipo
    );

    return { centro: centro.nome, recursos };
  } catch (error) {
    throw new Error(
      `Erro ao buscar relatorio com a quantidade média de recursos ${error.message}`
    );
  }
}
export async function relatorioIntercambio(dataInicio, dataFim, centroId) {
  try {
    const filtro = {};

    // Filtrar negociação
    if (dataInicio) {
      filtro["dataCriacao"] = {
        ...filtro["dataCriacao"],
        $gte: new Date(inicio),
      };
    }
    if (dataFim) {
      filtro["dataCriacao"] = { ...filtro["dataCriacao"], $lte: new Date(fim) };
    }
    if (centroId) {
      filtro["centroId"] = centroId;
    }

    const intercambios = await negociacao
      .find(filtro)
      .populate("centroOrigem", "nome")
      .populate("centroDestino", "nome");

    return intercambios.map((negociacao) => ({
      id: negociacao._id,
      centroOrigem: negociacao.centroOrigem.nome,
      centroDestino: negociacao.centroDestino.nome,
      recursosOrigem: negociacao.recursosOrigem,
      recursosDestino: negociacao.recursosDestino,
      data: negociacao.data,
    }));
  } catch (error) {
    throw new Error(
      `Erro ao buscar historicos de negociações ${error.message}`
    );
  }
}
