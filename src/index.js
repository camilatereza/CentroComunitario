require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Middleware para analisar o corpo das requisições
app.use(express.json());

// Configuração do Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Centro Comunitario API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"], // Caminho para os arquivos de rotas onde a documentação estará
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rotas
const centroComunitarioRoutes = require("./routes/centroRoute");
const relatoriosRoutes = require("./routes/relatorioRoute");

app.use("/api", centroComunitarioRoutes);
app.use("/api", relatoriosRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
