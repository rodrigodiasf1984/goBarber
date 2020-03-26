import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.server.use(Sentry.Handlers.requestHandler());
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors()); // dev
    // this.server.use(cors({ origin: 'https://gobarber.com.br' }));//prod
    this.server.use(express.json());
    // express.static() permite que os arquivos sejam acessados através do navegador
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
