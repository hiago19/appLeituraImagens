# Usar a imagem oficial do Node.js como base
FROM node:18 as builder

# Instale o cliente MySQL
RUN apt-get update && apt-get install -y default-mysql-client

# Definir o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

#Instalar dependecias e executar
RUN npm install

# Copiar todos os arquivo (1º '.') e colar no diretório criado (2º '.')
COPY . .

# Expor a porta que o servidor vai usar
EXPOSE 3000

# Iniciar a aplicação
CMD ["npm", "run", "dev"]