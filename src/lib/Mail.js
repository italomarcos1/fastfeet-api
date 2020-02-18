import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig; // dados de configuração do email. o mailtrap exporta

    this.transporter = nodemailer.createTransport({
      // instância de transporter
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // pra caso tenha um campo user no auth
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); // path da pasta de emails

    this.transporter.use(
      // método para adicionar configuração no transporter
      'compile', // define como compilamos os templates de email, como serão mostrados
      nodemailerhbs({
        // integração do nodemailer com o handlebars. envio de email com os templates
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'), // pasta de layouts
          partialsDir: resolve(viewPath, 'partials'), // layouts partials. parte específica que se repete, como um footer
          defaultLayout: 'default', // layout default de email. utilizado para todos os envios
          extname: '.hbs', // nome da extensão. no caso, a extensão do handlebars
        }),
        viewPath, // caminho das pastas de emails
        extName: '.hbs', // nome da extensão. no caso, a extensão do handlebars
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
