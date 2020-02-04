# goBarber
Aplicação para marcação de horários

Executar os comandos no Terminal CMD 
Para instalar as dependências do projeto é necessário abrir o terminal na pasta onde o projeto se encontra ex.: 
  C:\users\rodri\Desktop\goBarber> yarn
  
Para rodar o projeto: 
  C:\users\rodri\Desktop\goBarber> yarn dev

Para testar as rotas usar o insomnia ou postman 

*Docker 
Abrir o site https://www.docker.com/products/docker-desktop

Efetuar o download do docker desktop e instalar, após instalação, abrir o programa para inicializar o "docker desktop"

Abrir o PowerShell como administrator( menu inicar do win => digite PowerShell=> Run as Administrator 

Executar os comandos no PowerShell

Criar container para o docker postgres base de dados
  docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres 

Para listar dos containers docker
  docker ps
  
Para iniciar o container 
  docker start database
  
Para verificar os logs do container 
  docker logs database
  
