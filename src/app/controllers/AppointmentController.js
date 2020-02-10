import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    // paginação, mostra 20 resultados por página
    const { page = 1 } = req.query; // caso não seja informado o número da página, por padrão será a página 1

    // retorna a lista de agendamento do utlizador que fez a requisição
    const listAppointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20, // lista somente 20 resultados
      offset: (page - 1) * 20, // serve para determina quantos registos eu quero pular
      include: [
        // include faz o relacionamento entre o agendamento e o utilizador do tipo provider neste caso, por isto usando o as:provider para indicar qual relacionamento desejamos utilizar, os relacionamento se encontram dentro do model appointment
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'], // retorna somente os campos dentro do array attributes
          include: [
            {
              model: File,
              as: 'avatar', // as: avatar
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    });
    return res.json(listAppointments);
  }

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
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });
    if (!checkIsProvider) {
      return res
        .status(401)
        .json('You can only create appointments with providers users');
    }

    const hourStart = startOfHour(parseISO(date));
    // verifica que a hora preenchida para o agendamento não é com minutos, ex 19:03, passa para 19:00
    if (isBefore(hourStart, new Date())) {
      // caso tente fazer um agendamento usando uma data antes da data actual
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // verifica se o prestador de serviço está tentando marcar um horário para um que já esteja marcado/reservado
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });
    if (checkAvailability) {
      // se verdadeiro o horário nã está vago
      return res
        .status(400)
        .json({ error: 'Appointment date is not available!' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
