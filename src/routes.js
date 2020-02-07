import multer from 'multer';
import { Router } from 'express';
import multerConfig from './config/multer';
// import somente o Router de dentro do express, server para separar a parte de roteamento
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

// middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware); // chama o middleware globalmente
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);
// rota para listar todos os prestadores de serviços da App
routes.get('/providers', ProviderController.index);

export default routes;
