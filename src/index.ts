import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes/index';

dotenv.config();

const app = express();                   // Inicializa o servidor Express

app.use(express.json());                 // Configura o servidor para aceitar JSON no corpo das requisições
app.use(routes);                         // Aplica as rotas da aplicação

const PORT = process.env.PORT || 3000;   // Define a porta do servidor

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
});
