import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // para cada job é necessário criar um chave única
    return 'CancellationMail';
  }

  async handle({ data }) {
    // é a tarefa que é executada quando for enviado cada e-mail de cancelamento
    // busca todos os dados referentes ao agendamento=== data

    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      suject: 'Agendamento cancelado',
      // a template do e-email, context são todas as variavéis dentro da template cancellation
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt
          }
        )
      }
    });
  }
}
export default new CancellationMail();
