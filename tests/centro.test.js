const express = require("express");
const bodyParser = require("body-parser");
const centroRoutes = require("../src/routes/centroRoute");
const centroService = require("../src/services/centroService");
const centroController = require("../src/controllers/centroController");
const { setupDB, teardownDB, clearDB } = require("../tests/setup");
const { validationResult } = require("express-validator");

const app = express();
app.use(bodyParser.json());
app.use("/api", centroRoutes);

// Mock para service
jest.mock("../src/services/centroService");

// Mock para o validationResult
jest.mock("express-validator", () => ({
  ...jest.requireActual("express-validator"),
  validationResult: jest.fn(),
}));

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await teardownDB();
});

afterEach(async () => {
  await clearDB();
});

describe("Centros Comunitários API", () => {
  it("Deve adicionar um novo centro comunitário", async () => {
    const req = {
      body: {
        nome: "Centro Teste",
        endereco: "Rua Teste, 123",
        localizacao: "Testelandia",
        capacidadeMaxima: 80,
        quantidadeAtual: 10,
        recursos: [
          { tipo: "voluntario", quantidade: 5 },
          { tipo: "medico", quantidade: 2 },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });
    centroService.adicionarCentro.mockResolvedValue(req.body);

    await centroController.adicionarCentro(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it("Deve atualizar a ocupação do centro informado", async () => {
    const centro = {
      _id: "63a0a1b2c3d4e5f67890abcd",
      nome: "Centro Teste",
      endereco: "Rua Teste, 123",
      localizacao: "Testelandia",
      capacidadeMaxima: 80,
      quantidadeAtual: 10,
      recursos: [
        { tipo: "voluntario", quantidade: 5 },
        { tipo: "medico", quantidade: 2 },
      ],
    };

    // Mocks
    validationResult.mockReturnValue({ isEmpty: () => true });
    centroService.adicionarCentro.mockResolvedValue(centro);
    centroService.atualizarOcupacao = jest
      .fn()
      .mockResolvedValue({ ...centro, quantidadeAtual: 60 });

    // Adicionando o centro
    const resAdd = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    const reqAdd = {
      body: centro,
    };

    await centroController.adicionarCentro(reqAdd, resAdd);

    // Atualizando ocupação
    const resUpdate = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    const reqUpdate = {
      params: { id: centro._id },
      body: { quantidadeAtual: 50 },
    };

    await centroController.atualizarOcupacao(reqUpdate, resUpdate);

    // Verificando a resposta
    expect(resUpdate.status).toHaveBeenCalledWith(200);
    expect(resUpdate.json).toHaveBeenCalledWith({
      ...centro,
      quantidadeAtual: 60,
    });
  });

  it("Deve realizar um intercâmbio de recurso entre centros", async () => {
    const centroOrigem = {
      _id: "63a0a1b2c3d4e5f67890abcd",
      nome: "Centro Origem",
      endereco: "Rua Origem, 123",
      localizacao: "OrigenLandia",
      capacidadeMaxima: 100,
      quantidadeAtual: 10,
      recursos: [
        { tipo: "voluntario", quantidade: 5 },
        { tipo: "medico", quantidade: 2 },
      ],
    };

    const centroDestino = {
      _id: "63a0a1b2c3d4e5f67890abcd",
      nome: "Centro Destino",
      endereco: "Rua Destino, 123",
      localizacao: "Destinolandia",
      capacidadeMaxima: 130,
      quantidadeAtual: 20,
      recursos: [
        { tipo: "voluntario", quantidade: 3 },
        { tipo: "veiculoTransporte", quantidade: 2 },
        { tipo: "cestaBasica", quantidade: 5 },
      ],
    };

    // Mocks
    centroService.adicionarCentro = jest
      .fn()
      .mockResolvedValueOnce(centroOrigem)
      .mockResolvedValueOnce(centroDestino);

    centroService.realizarIntercambio = jest.fn().mockResolvedValue({
      _id: "intercambio123",
      sucesso: true,
    });

    validationResult.mockReturnValue({ isEmpty: () => true });

    // Adicionar centro origem
    const reqOrigem = {
      body: centroOrigem,
    };

    const resOrigem = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
      headersSent: false,
    };

    await centroController.adicionarCentro(reqOrigem, resOrigem);

    // Adicionar centro destino
    const reqDestino = {
      body: centroDestino,
    };

    const resDestino = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
      headersSent: false,
    };

    await centroController.adicionarCentro(reqDestino, resDestino);

    // Realizar intercâmbio
    const intercambio = {
      recursosOrigem: [
        { tipo: "voluntario", quantidade: 1 },
        { tipo: "medico", quantidade: 1 },
      ],
      recursosDestino: [
        { tipo: "veiculoTransporte", quantidade: 1 },
        { tipo: "cestaBasica", quantidade: 1 },
      ],
    };

    const intercambioReq = {
      params: { id: centroOrigem._id },
      body: intercambio,
    };

    const intercambioRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
      headersSent: false,
    };

    await centroController.realizarIntercambio(intercambioReq, intercambioRes);

    // Testes
    expect(intercambioRes.status).toHaveBeenCalledWith(200);
    expect(intercambioRes.json).toHaveBeenCalledWith({
      _id: "intercambio123",
      sucesso: true,
    });
  });
});
