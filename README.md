
## :rocket: Sobre o desafio

Criar uma api **REST** com **Node.js ** para agendamento de barbearia, a mesma permite aos usuários agendar uma consulta com seu barbeiro favorito e mostra ao barbeiro sua agenda comm os agendamentos para o dia.

## :clipboard: Iniciando a aplicação

1. Clone o repositório com `git clone https://github.com/rodrigodiasf1984/goBarber.git`
2. Instalar o Docker https://www.docker.com/products/docker-desktop 
3. Abrir o PowerShell como administrator( menu inicar do win => digite PowerShell=> Run as Administrator
4. Criar os containers docker para as bases de dados postgres, mongodb, redis: 
5. `docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`
6. `docker run --name redisbarber -p 6379:6379 -d -t redis:alpine` 
7. `docker run --name mongobarber -p 27017:27017 -d -t mongo`
8. Para listar dos containers docker:
9. `docker ps`
10. Para iniciar os containers: 
11. `docker start database` e `docker start redisbarber` e `docker start mongobarber`
12. No terminal entre dentro da pasta onde o projeto foi salvo com `cd goBarber`
13. Instalar as dependências do projeto exceute o comando a seguir no terminal:
14. `yarn`
15. Criar a base de dados gobarber no postbird 
16. Executar as migrations para criar a base de dados:
17. `yarn sequelize db:migrate`
18. Para excutar a api execute o comando a seguir no terminal:
19. `yarn start`ou `yarn dev` caso esteja em modo desenvolvimento
20. Para testar use a aplicação seguinte:
21. **https://insomnia.rest/**

## :hammer: Ferramentas usadas

- 📄 **<a href="https://nodejs.org/en/" rel="nofollow">Node.js</a>**
- 📄 **<a href="https://expressjs.com/" rel="nofollow">Express</a>** 
- 📄 **<a href="https://nodemon.io/" rel="nofollow">nodemon</a>** 
- 📄 **<a href="https://github.com/alangpierce/sucrase">Sucrase</a>** 
- 📄 **<a href="https://www.docker.com/docker-community" rel="nofollow">Docker</a>** 
- 📄 **<a href="http://docs.sequelizejs.com/" rel="nofollow">Sequelize</a>** 
- 📄 **<a href="https://www.postgresql.org/" rel="nofollow">PostgreSQL</a>** 
- 📄 **<a href="https://www.npmjs.com/package/pg" rel="nofollow">node-postgres</a>** 
- 📄 **<a href="https://jwt.io/" rel="nofollow">JWT</a>** 
- 📄 **<a href="https://www.npmjs.com/package/bcrypt" rel="nofollow">Bcrypt</a>** 
- 📄 **<a href="https://www.npmjs.com/package/yup" rel="nofollow">Yup</a>** 
- 📄 **<a href="https://code.visualstudio.com/" rel="nofollow">VS Code</a>**
- 📄 **<a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint" rel="nofollow">ESLint</a>** 




