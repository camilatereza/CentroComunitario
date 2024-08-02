const mongoose = require("mongoose");

const negociacaoSchema = new mongoose.Schema({
  centroOrigem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CentroComunitario",
  },
  centroDestino: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CentroComunitario",
  },
  recursosOrigem: [
    {
      tipo: String,
      quantidade: Number,
    },
  ],
  recursosDestino: [
    {
      tipo: String,
      quantidade: Number,
    },
  ],
  dataCriacao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Negociacao", negociacaoSchema);
