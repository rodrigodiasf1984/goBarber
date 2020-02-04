import { Router } from 'express';
// import somente o Router de dentro do express, server para separar a parte de roteamento
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

export default routes;
