import User from '../models/User';

class UserController {
  async store(req, res) {
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

    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new UserController();
