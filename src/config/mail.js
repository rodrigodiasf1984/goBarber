export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  default: {
    from: 'Equipe Gobarber<noreply@gobarber.com>'
  }
};

// serviço de email
// Ambiente de produção:
/* Amazon SES
 *Mailgun
 *SparkPost
 *Mandril(MailChimp)
 */

// Ambiente de DEV
// Mailtrap=Y mailtrao.io
