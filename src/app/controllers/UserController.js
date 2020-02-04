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
}

export default new UserController();
