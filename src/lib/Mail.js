import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null // verifica se existe um utilizador dentro da variável auth, visto que algumas estratégias de envio não precisam de utilizador logado
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default, // busca tudo que estiver dentro do default dentro do config/mail
      ...message // busca tudo que vem ada mensagem dentro do appointmentController
    });
  }
}
export default new Mail();
