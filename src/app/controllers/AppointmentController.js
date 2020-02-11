import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class AppointmentController {
  // Esses métodos são para o utilizador comum da App, ou seja o cliente
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
    // Notificar prestador de serviços
    const user = await User.findByPk(req.userId);
    const formtattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formtattedDate}`,
      user: provider_id
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    // busca o agendamento
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        // esse include serve para incluir as informações do prestador de serviço
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        }
      ]
    });
    // verifica se o utilizador que está tentando apagar o agendamento é o mesmo que criou
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment."
      });
    }
    // o cliente só pode desmarcar o agendamento até duas horas antes.
    const dateWithSub = subHours(appointment.date, 2); // recupera a hora do agendamento e remove 2 horas do mesmo
    if (isBefore(dateWithSub, new Date())) {
      // verifica se o horário do agendamento já substraído as 2 horas é igual a hora actual

      return res.status(401).json({
        error: 'You can only cancel the appointment 2 hours in advance.'
      });
    }
    // caso o pedido de cancelamento do agendamento for feito 2 horas antes atualiza a data de cancelamento para a data e hora atual
    appointment.canceled_at = new Date();
    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      suject: 'Agendamento cancelado',
      text: 'Vocè tem um novo cancelamento'
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
