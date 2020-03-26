import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      // verifica que todos os campos da requisição estão devidamente preenchidos
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos obrigatórios não preenchidos!' });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'Este utilizador já existe!' });
    }
    const { id, name, email, provider } = await User.create(req.body); // retorna somente os campos necessários
    return res.json({
      // retorna um objeto json com os campos da desestruturação da linha anterior
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      // verifica que todos os campos da requisição estão devidamente preenchidos
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (
          oldPassword,
          field // verifica se a variável oldPassword está preenchida se sim, o campo password no corpo da requisição será obrigatório
        ) => (oldPassword ? field.required() : field)),
      confirmPassword: Yup.string().when(
        'password',
        (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        // verifica se o confirmPassword e o password são iguais
      )
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Campos obrigatórios não preenchidos!' });
    }
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      // verifica se o utilizador quer alterar o email, se sim a primeira variável do if será válida e a segunda condição(verificar se o email da bd e o da req são diferentes) também
      const userExists = await User.findOne({
        where: { email }
      });

      if (userExists) {
        return res.status(400).json({ error: 'Este utilizador já existe!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      // verificar se a variável para trocar senha foi preenchida se sim, verifica a segunda condição, verifica se a senha antiga == a senha na BD
      return res.status(401).json({ error: 'Senha inválida' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    });

    return res.json({
      id,
      name,
      email,
      avatar
    });
  }
}

export default new UserController();
