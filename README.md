# Aplicação de Leitura de Imagens

**Aplicação de Leitura de Imagens** é uma aplicação web que permite a leitura individualizada de consumo de água e gás através de imagens de medidores. A aplicação utiliza a API do Google Gemini para extrair os valores das imagens enviadas.

## Estrutura

O projeto está estruturado em vários arquivos principais:

- **src/controllers/controller.ts**: Contém a lógica para manipulação das requisições da API.
- **src/services/service.ts**: Contém a integração com a API do Google Gemini.
- **src/routes/index.ts**: Define as rotas da API.
- **src/utils/mimetypes.ts**: Utilitário para obter tipos MIME com base nas extensões de arquivos.
- **prisma/schema.prisma**: Define o esquema do banco de dados utilizando Prisma ORM.
- **package.json**: Define as dependências e scripts do projeto.
- **tsconfig.json**: Configurações do TypeScript.
- **jest.config.js**: Configurações do Jest para testes.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Node.js**: Para o desenvolvimento do servidor.
- **TypeScript**: Para tipagem estática e desenvolvimento mais seguro.
- **Express**: Framework para criação de APIs REST.
- **Prisma**: ORM para interação com o banco de dados.
- **Jest**: Para testes unitários.
- **Docker**: Para containerização da aplicação.

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js** (versão recomendada: >= 14.x)
- **Docker** e **Docker Compose** (para rodar a aplicação em containers)

## Rodando Localmente

Para executar o projeto localmente, siga estas etapas:

1. Clone o repositório para sua máquina local:

   ```bash
   git clone https://github.com/hiago19/appLeituraImagens.git
   ```
2. Navegue até o diretório do projeto:

   ```bash
   cd appLeituraImagens
   ```

3. Instale as dependências:
   
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   
   ```bash
   GEMINI_API_KEY=<sua-chave-da-api>
   DATABASE_URL="mysql://root:root@db:3306/measures"
   ```
   - GEMINI_API_KEY: Pode ser obtida na [documentação da API do Google Gemini](https://ai.google.dev/gemini-api/docs/api-key).
   - DATABASE_URL: Conexão com o banco de dados, usada no ambiente Docker.

5. Compile o código TypeScript:
   
   ```bash
   npm run build
   ```

6. Inicie a aplicação:
   
   ```bash
   npm run start
   ```

7. Inicie a aplicação usando Docker, isso irá iniciar a aplicação juntamente com o banco de dados:
   
   ```bash
   docker-compose up --build
   ```

8. Acesse o contêiner da aplicação, isso permitirá executar os testes unitários ou acessar o banco de dados:
   
   ```bash
   docker exec -it leituraimagens-app-1 /bin/sh # Acesso direto ao contêiner
   docker exec -it leituraimagens-app-1 mysql -u root -p -h db -P 3306 measures # Acesso direto ao MySql
   ```

9. Execute os testes unitários:
   
   ```bash
   npm test
   ```

## Funcionalidades

- **Upload de Imagem**: Recebe uma imagem em base64, consulta o Gemini e retorna a medida lida pela API.
- **Confirmar Medida**: Confirma ou corrige o valor lido pelo LLM.
- **Listar Medidas**: Lista as medidas realizadas por um determinado cliente.

## Demonstração

Aqui estão algumas capturas de tela do projeto em execução:

1. **POST /upload**:
   ![post](https://github.com/user-attachments/assets/89132671-4770-4de3-8e39-8bd056411171)

   
2. **PATCH /confirm**:
   ![path](https://github.com/user-attachments/assets/dddc8b9e-6312-4ad2-b9bb-4db5f62ed9ec)


3. **GET /<customer code>/list**:
   ![get](https://github.com/user-attachments/assets/a0a43d51-08e9-4e3c-9302-ac660c00f2ee)



## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
