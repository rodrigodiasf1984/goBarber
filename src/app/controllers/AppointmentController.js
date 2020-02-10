import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    // validação usando o YUP
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(), // chave estrangeira obrigatório
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;
    /*
     * Verifica se o provider_id e um utilizador do tipo provedor de serviços
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });
    if (!isProvider) {
      return res
        .status(401)
        .json('You can only create appointments with providers users');
    }
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
