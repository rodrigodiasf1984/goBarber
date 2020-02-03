import { Router } from 'express';
// import somente o Router de dentro do express, server para separar a parte de roteamento
const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello world' }));

export default routes;
