import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { date, deliveryman, recipient } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Uma nova encomenda chegou.',
      template: 'neworder',
      context: {
        deliveryman: deliveryman.name,
        name: recipient.name,
        number: recipient.number,
        street: recipient.street,
        complement: recipient.complement,
        city: recipient.city,
        state: recipient.state,
        cep: recipient.cep,
        date: format(
          parseISO(date),
          "'dia' dd 'de' MMMM', às' H:mm'h'", // entre aspas simples não é manipulado e MMMM escreve o mês por extenso.
          { locale: pt }
        ),
      },
    });
  }
}

export default new NewOrderMail();
