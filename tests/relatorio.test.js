const express = require("express");
const bodyParser = require("body-parser");
const relatorioRoutes = require("../src/routes/relatorioRoute");
const relatorioService = require("../src/services/relatorioService");
const relatorioController = require("../src/controllers/relatorioController");
const { setupDB, teardownDB, clearDB } = require("../tests/setup");
const { validationResult } = require("express-validator");

const app = express();
app.use(bodyParser.json());
app.use("/api", relatorioRoutes);

// Mock para service
jest.mock("../src/services/relatorioService");

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

describe("Relatórios API", () => {
  it("Deve obter o relatório de ocupação", async () => {
    const centros = [
      {
        capacidadeMaxima: 100,
        quantidadeAtual: 50,
        data: new Date("2023-01-01"),
      },
      {
        capacidadeMaxima: 200,
        quantidadeAtual: 150,
        data: new Date("2023-01-02"),
      },
    ];

    relatorioService.relatorioOcupacao = jest.fn().mockResolvedValue({
      totalCapacidade: 300,
      totalAtual: 200,
    });

    const req = {
      query: {
        inicio: "2023-01-01",
        fim: "2023-01-31",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioOcupacao(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalCapacidade: 300,
      totalAtual: 200,
    });
  });

  it("Deve retornar relatório de ocupação para todos os centros quando datas não são fornecidas", async () => {
    const centros = [
      {
        capacidadeMaxima: 100,
        quantidadeAtual: 50,
        data: new Date("2023-01-01"),
      },
      {
        capacidadeMaxima: 200,
        quantidadeAtual: 150,
        data: new Date("2023-01-02"),
      },
    ];

    relatorioService.relatorioOcupacao = jest.fn().mockResolvedValue({
      totalCapacidade: 300,
      totalAtual: 200,
    });

    const req = {
      query: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioOcupacao(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalCapacidade: 300,
      totalAtual: 200,
    });
  });

  it("Deve retornar erro ao falhar na obtenção do relatório de ocupação", async () => {
    relatorioService.relatorioOcupacao = jest
      .fn()
      .mockRejectedValue(new Error("Erro ao obter relatório"));

    const req = {
      query: {
        inicio: "2023-01-01",
        fim: "2023-01-31",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioOcupacao(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao obter relatório",
    });
  });

  it("Deve obter o relatório de recursos", async () => {
    relatorioService.relatorioRecursos = jest.fn().mockResolvedValue({
      totalRecursos: 150,
    });

    const req = {
      query: {
        inicio: "2023-01-01",
        fim: "2023-01-31",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioRecursos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalRecursos: 150,
    });
  });

  it("Deve retornar relatório de recursos para todos os centros quando datas não são fornecidas", async () => {
    relatorioService.relatorioRecursos = jest.fn().mockResolvedValue({
      totalRecursos: 150,
    });

    const req = {
      query: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioRecursos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalRecursos: 150,
    });
  });

  it("Deve obter o relatório de intercâmbios", async () => {
    relatorioService.relatorioIntercambio = jest.fn().mockResolvedValue({
      totalIntercambios: 10,
    });

    const req = {
      query: {
        inicio: "2023-01-01",
        fim: "2023-01-31",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioIntercambio(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalIntercambios: 10,
    });
  });

  it("Deve retornar relatório de intercâmbios para todos os centros quando datas não são fornecidas", async () => {
    relatorioService.relatorioIntercambio = jest.fn().mockResolvedValue({
      totalIntercambios: 10,
    });

    const req = {
      query: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };

    validationResult.mockReturnValue({ isEmpty: () => true });

    await relatorioController.relatorioIntercambio(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalIntercambios: 10,
    });
  });
});
