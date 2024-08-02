const { MongooseError } = require("mongoose");
const CentroComunitario = require("../models/centroComunitario");
const Negociacao = require("../models/negociacao");

 async function existCentro(centro) {
  try {
    const centro = await CentroComunitario.findOne(centro);

    if (centro) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new MongooseError(
      `Erro ao encontrar Centro Comunitário ${err.message}`
    );
  }
}

 async function existNegociacao(negociacaoNome) {
  try {
    const negociacao = await Negociacao.findOne(negociacaoNome);

    if (negociacao) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new MongooseError(`Erro ao encontrar Negociação ${err.message}`);
  }
}

module.exports = {
  existCentro,
  existNegociacao,
};
