import { Router } from 'express';
// import somente o Router de dentro do express, server para separar a parte de roteamento
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware); // chama o middleware globalmente
routes.put('/users', UserController.update);

export default routes;
