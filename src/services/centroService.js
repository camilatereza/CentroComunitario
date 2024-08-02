const { Error } = require("mongoose");
const centroComunitario = require("../models/centroComunitario");
const { existCentro } = require("../utils/validation");

async function adicionarCentro(centroBody) {
  try {
    const exist = existCentro(centroBody.nome);

    if (!exist) {
      const centro = new centroComunitario(centroBody);
      return await centro.save();
    } else {
      throw new Error("O Centro comunitário já existe");
    }
  } catch (error) {
    throw new Error(
      `Erro ao adicionar novo Centro Comunitário: ${error.message}`
    );
  }
}

async function atualizarOcupacao(id, quantidadeAtual) {
  try {
    const centro = await centroComunitario.findById(id);
    if (!centro) {
      throw new Error("Centro comunitário não encontrado");
    }

    centro.quantidadeAtual += quantidadeAtual;

    if (centro.quantidadeAtual >= centro.capacidadeMaxima) {
      // Criar serviço de notificação
      console.log(
        "status: 500, message: O Centro Comunitário atingiu sua capacidade máxima"
      );
    }

    return await centro.save();
  } catch (err) {
    throw new Error(
      `Erro ao atualizar ocupação do Centro Comunitario ${err.message}`
    );
  }
}

async function realizarIntercambio(
  id,
  { centroDestinoId, recursosOrigem, recursosDestino }
) {
  try {
    const centroOrigem = centroComunitario.findById(id);
    const centroDestino = centroComunitario.findById(centroDestinoId);

    if (!centroOrigem || !centroDestino) {
      throw new Error("Centro comunitário não encontrado");
    }

    //Calcular pontos trocados
    const pontosOrigem = recursosOrigem.reduce(
      (total, recurso) =>
        total + getPontosRecurso(recurso.tipo) * recurso.quantidade,
      0
    );
    const pontosDestino = recursosDestino.reduce(
      (total, recurso) =>
        total + getPontosRecurso(recurso.tipo) * recurso.quantidade,
      0
    );

    if (
      pontosOrigem !== pontosDestino &&
      (centroOrigem.quantidadeAtual < 0.9 * centroOrigem.capacidadeMaxima ||
        centroDestino.quantidadeAtual < 0.9 * centroDestino.capacidadeMaxima)
    ) {
      throw new Error(
        "Os pontos dos recursos devem ser iguais para realizar o intercâmbio"
      );
    }

    // Os recursos oferecido são adicionado ao centroDestino e
    // Os recursos vindos do destino são add ao centroOrigem
    atualizarRecursos(centroOrigem, recursosOrigem, "remove");
    atualizarRecursos(centroOrigem, rescursosDestino, "add");

    atualizarRecursos(centroDestino, recursosDestino, "remove");
    atualizarRecursos(centroDestino, recursosOrigem, "add");

    await centroOrigem.save();
    await centroDestino.save();

    const negociacao = new Negociacao({
      centroOrigem: id,
      centroDestino: centroDestinoId,
      recursosOrigem,
      recursosDestino,
      data: new Date(),
    });

    return await negociacao.save();
  } catch (error) {
    throw new Error(
      `Não foi possivel realizar um intercambio de recursos entre centros: ${error.message}`
    );
  }
}

function getPontosRecurso(tipo) {
  const tabelaPontos = {
    medico: 4,
    voluntario: 3,
    kitSuprimentosMedicos: 7,
    veiculoTransporte: 5,
    cestaBasica: 2,
  };
  return tabelaPontos[tipo] || 0;
}

function atualizarRecursos(centro, recursos, operacao) {
  recursos.forEach((recurso) => {
    const index = centro.recursos.findIndex((r) => r.tipo === recurso.tipo);

    if (index !== -1) {
      if (operacao === "add") {
        centro.recursos[index].quantidade += recurso.quantidade;
      } else if (operacao === "remove") {
        centro.recursos[index].quantidade -= recurso.quantidade;
      }
    } else if (operacao === "add") {
      centro.recursos.push(recurso);
    }
  });
}

module.exports = {
  adicionarCentro,
  atualizarOcupacao,
  realizarIntercambio,
};
