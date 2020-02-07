import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // local onde as imagens são guardadas
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // controla o nome da imagem
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // retorna o nome do arquivo como hexadécimal e concatena com a extensão do mesmo. Ex: 13a1dsfadf131.jpg
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    }
  })
};
