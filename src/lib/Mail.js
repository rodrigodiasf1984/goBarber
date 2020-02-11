import nodemailer from 'nodemailer';
import { resolve } from 'path'; // o resolve vai indicar o caminho onde as templates estão salvas
import expressHandleBars from 'express-handlebars'; // templates para os emails
import nodemailerHandleBars from 'nodemailer-express-handlebars'; // integração com o nodeMailer
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
    this.configuretemplates();
  }

  configuretemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerHandleBars({
        viewEngine: expressHandleBars.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs'
        }),
        viewPath,
        extName: '.hbs'
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default, // busca tudo que estiver dentro do default dentro do config/mail
      ...message // busca tudo que vem ada mensagem dentro do appointmentController
    });
  }
}
export default new Mail();
