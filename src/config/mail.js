export default {
  host: 'smtp.mailtrap.io',
  port: '2525',
  secure: false,
  auth: {
    user: 'a15ebe75e32b97',
    pass: 'f41921fed78180'
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
