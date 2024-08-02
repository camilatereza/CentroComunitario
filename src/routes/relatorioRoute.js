const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const { query } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Relatorios de Negociação
 *   description: Endpoints para relatórios
 */

/**
 * @swagger
 * /api/relatorios/ocupacao:
 *   get:
 *     summary: Relatório de centros com ocupação maior que 90%
 *     tags: [Relatorios]
 *     responses:
 *       200:
 *         description: Lista de centros com ocupação maior que 90%
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CentroComunitario'
 */
router.get(
  "/relatorios/ocupacao",
  [
    query("dataInicio")
      .optional()
      .isISO8601()
      .withMessage("Data de início inválida"),
    query("dataFim").optional().isISO8601().withMessage("Data de fim inválida"),
  ],
  relatorioController.relatorioOcupacao
);

/**
 * @swagger
 * /api/relatorios/recursos:
 *   get:
 *     summary: Quantidade média de cada tipo de recurso
 *     tags: [Relatorios]
 *     responses:
 *       200:
 *         description: Quantidade média de cada tipo de recurso por centro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 medico:
 *                   type: number
 *                   description: Média de médicos por centro
 *                 voluntario:
 *                   type: number
 *                   description: Média de voluntários por centro
 *                 kitSuprimentosMedicos:
 *                   type: number
 *                   description: Média de kits de suprimentos médicos por centro
 *                 veiculoTransporte:
 *                   type: number
 *                   description: Média de veículos de transporte por centro
 *                 cestaBasica:
 *                   type: number
 *                   description: Média de cestas básicas por centro
 */
router.get(
  "/relatorios/recursos",
  [
    query("centroId").isMongoId().withMessage("ID do centro inválido"),
    query("tipo")
      .optional()
      .isString()
      .withMessage("Tipo de recurso deve ser uma string"),
  ],
  relatorioController.relatorioRecursos
);

/**
 * @swagger
 * /api/relatorios/negociacoes:
 *   get:
 *     summary: Histórico de negociações, com filtros
 *     tags: [Relatorios]
 *     parameters:
 *       - in: query
 *         name: centroId
 *         schema:
 *           type: string
 *         description: ID do centro comunitário
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de início para filtro de negociações
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de término para filtro de negociações
 *     responses:
 *       200:
 *         description: Histórico de negociações filtrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Negociacao'
 */
router.get(
  "/relatorios/negociacoes",
  [
    query("dataInicio")
      .optional()
      .isISO8601()
      .withMessage("Data de início inválida"),
    query("dataFim").optional().isISO8601().withMessage("Data de fim inválida"),
    query("centroId")
      .optional()
      .isMongoId()
      .withMessage("ID do centro inválido"),
  ],
  relatorioController.relatorioIntercambio
);

module.exports = router;
