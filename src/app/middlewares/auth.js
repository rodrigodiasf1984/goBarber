import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
// middleware para verificar se o utilizador está logado, usando o token
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // verifica se o Token foi enviado na requisição
    return res.status(401).json({ error: 'Token não enviado na requisição!' });
  }
  const [, token] = authHeader.split(' '); // recupera o token da resposta do corpo da requisição
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); // decodifica e verifica se o token é válido
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
