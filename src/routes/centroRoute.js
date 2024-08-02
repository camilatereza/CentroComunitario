const express = require("express");
const router = express.Router();
const centroController = require("../controllers/centroController");
const { body, param } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Centros Comunitários
 *   description: Endpoints para gerenciamento de centros comunitários
 */

/**
 * @swagger
 * /api/centros:
 *   post:
 *     summary: Adicionar um novo centro comunitário
 *     tags: [Centros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CentroComunitario'
 *     responses:
 *       201:
 *         description: Centro comunitário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CentroComunitario'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Já existe um centro com esse nome
 */
router.post(
  "/centros",
  [
    body("nome").notEmpty().withMessage("Nome é obrigatório"),
    body("endereco").notEmpty().withMessage("Endereço é obrigatório"),
    body("localizacao").notEmpty().withMessage("Localização é obrigatória"),
    body("capacidadeMaxima")
      .isInt({ gt: 0 })
      .withMessage("Capacidade máxima deve ser um número inteiro maior que 0"),
    body("quantidadeAtual")
      .isInt({ gt: -1 })
      .withMessage("Quantidade atual deve ser um número inteiro não negativo"),
    body("recursos")
      .isArray()
      .withMessage("Recursos devem ser uma lista com tipos e quatidades"),
  ],
  centroController.adicionarCentro
);

/**
 * @swagger
 * /api/centros/{id}/ocupacao:
 *   put:
 *     summary: Atualizar ocupação de um centro comunitário
 *     tags: [Centros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do centro comunitário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidadeAtual:
 *                 type: number
 *                 description: Nova quantidade de pessoas no centro
 *     responses:
 *       200:
 *         description: Ocupação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CentroComunitario'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Centro comunitário não encontrado
 */
router.put(
  "/centros/:id/ocupacao",
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("quantidadeAtual")
      .isInt({ gt: -1 })
      .withMessage("Quantidade atual deve ser um número inteiro não negativo"),
  ],
  centroController.atualizarOcupacao
);

/**
 * @swagger
 * /api/centros/{id}/intercambio:
 *   post:
 *     summary: Realizar intercâmbio de recursos entre centros
 *     tags: [Centros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do centro comunitário que está oferecendo recursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               centroDestinoId:
 *                 type: string
 *                 description: ID do centro comunitário que está recebendo recursos
 *               recursosOrigem:
 *                 type: array
 *                 description: Recursos que o centro irá enviar
 *                 items:
 *                   type: object
 *                   properties:
 *                     tipo:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *               recursosDestino:
 *                 type: array
 *                 description: Recursos que o centro irá receber
 *                 items:
 *                   type: object
 *                   properties:
 *                     tipo:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *     responses:
 *       200:
 *         description: Intercâmbio realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Negociacao'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Centro comunitário não encontrado
 */
router.post(
  "/centros/:id/intercambio",
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("centroDestinoId")
      .isMongoId()
      .withMessage("ID do centro de destino inválido"),
    body("recursosOrigem")
      .isArray()
      .withMessage("Recursos de origem devem ser uma lista"),
    body("recursosDestino")
      .isArray()
      .withMessage("Recursos de destino devem ser uma lista"),
  ],
  centroController.realizarIntercambio
);

module.exports = router;
