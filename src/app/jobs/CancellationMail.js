import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order, recipient, delivery_man, description } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${delivery_man.name} <${delivery_man.email}>`,
      subject: 'Uma de suas encomendas foi cancelada.',
      template: 'cancellation',
      context: {
        deliveryman: delivery_man.name,
        id: order.id,
        product: order.product,
        name: recipient.name,
        number: recipient.number,
        street: recipient.street,
        description,
        city: recipient.city,
        state: recipient.state,
        cep: recipient.cep,
      },
    });
  }
}

export default new NewOrderMail();
