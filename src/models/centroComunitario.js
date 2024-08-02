const mongoose = require("mongoose");

const recursoSchema = new mongoose.Schema({
  tipo: String,
  quantidade: Number,
  pontos: Number,
});

const centroComunitarioSchema = new mongoose.Schema({
  nome: String,
  endereco: String,
  localizacao: String,
  capacidadeMaxima: Number,
  quantidadeAtual: Number,
  recursos: [recursoSchema],
});

module.exports = mongoose.model("CentroComunitario", centroComunitarioSchema);
