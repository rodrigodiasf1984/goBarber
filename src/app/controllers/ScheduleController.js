import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'; // São os operadores do sequelize
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });
    if (!checkUserIsProvider) {
      return res.status(401).json();
    }
    const { date } = req.query;
    const parsedDate = parseISO(date); // converte para data sem o fuso horário
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          // inicio do dia 00:00:00
          // [Op.between] é uma chave do objeto date{}
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
          // fim do dia 23:59:59
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      order: ['date']
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
