import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      // verifica que todos os campos no momento do login estão devidamente preenchidos
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos obrigatórios não preenchidos!' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilizador não encontrado' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida!' });
    }

    const { id, name, avatar, provider } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
