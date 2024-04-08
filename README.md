
# API Encurtador de URLs

Uma API simples para encurtar URLs e gerenciar links encurtados.

## Como usar

1. Clone o repositório:

   ```bash
   git clone https://github.com/Withene/PetitLien.git
   cd PetitLien
   ```

2. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis, lembrando que disponibilizei um .env_exemple:

   ```
    DB_HOST= 
    DB_USER=
    DB_PASS=
    DB_NAME=
    APP_SECRET=
    PORT=8000
   ```

3. Instale as dependências ou rode o compose (prefira o docker compose):

   - Com Node:
     ```bash
     npm install
     ```

   - Com Docker Compose:

     Certifique-se de ter o Docker e o Docker Compose instalados. Obs: caso use o docker compose, pode pular a parte 4.
     
     ```bash
     docker-compose up
     ```

4. Execute a aplicação:

   ```bash
   npm dev
   ```

5. Acesse a documentação da API:

   A documentação da API está disponível em `http://localhost/v1/api-docs`.

6. Use a API:

   - Para encurtar uma URL, envie um POST para `/minify` com o corpo contendo a URL a ser encurtada:

     ```json
     {
       "url": "https://www.example.com"
     }
     ```

   - Para listar todos os links encurtados por um usuário, envie um GET para `/minify/list` com o cabeçalho `Authorization` contendo o token JWT do usuário.

   - Para editar a URL original de um link encurtado, envie um PUT para `/minify/edit/{id}` com o corpo contendo a nova URL e o cabeçalho `Authorization` com o token JWT do usuário.

   - Para excluir um link encurtado, envie um DELETE para `/minify/delete/{id}` com o cabeçalho `Authorization` contendo o token JWT do usuário.

## Dependências

- Node.js
- Express
- Sequelize (com banco de dados Postgresql)
- JWT para autenticação
