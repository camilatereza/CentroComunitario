# Usar a imagem oficial do Node.js
FROM node:18

# Criar e definir o diretório de trabalho
WORKDIR /usr/src

# Copiar os arquivos do projeto para o contêiner
COPY package*.json ./
RUN npm install
COPY . .

# Expor a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD [ "node", "src/index.js" ]
# CMD ["npm", "start"]
