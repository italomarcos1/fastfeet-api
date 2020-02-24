// colocar a opção de cancelar a entrega. -- CONTROLLER DE PROBLEMA
// o front deve ter um botao cancel e um deliver -- CONTROLLER DE PROBLEMA
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import Deliverymen from '../models/Deliverymen';

class DeliveryProblemController {
  async store(req, res) {
    const { delivery_id } = req.params;
    const { description } = req.body;

    const order = await Order.findByPk(delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'number', 'street', 'city'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }

    const { id } = await DeliveryProblem.create({ delivery_id, description });

    return res.json({ id, description, order });
  }

  async index(req, res) {
    const problems = await DeliveryProblem.findAll();

    return res.json(problems);
  }

  async show(req, res) {
    const { delivery_id } = req.params;

    const orders = await DeliveryProblem.findAll({
      where: { delivery_id },
    });

    return res.json(orders);
  }

  async delete(req, res) {
    try {
      const { delivery_id, description } = await DeliveryProblem.findByPk(
        req.params.id
      );

      const order = await Order.findOne({ where: { id: delivery_id } });
      const { recipient_id, deliveryman_id } = order;

      if (!order) {
        return res.status(400).json({ message: 'Essa encomenda não existe.' });
      }

      const [recipient, delivery_man] = await Promise.all([
        Recipient.findOne({ where: { id: recipient_id } }),
        Deliverymen.findOne({
          where: { id: deliveryman_id },
        }),
      ]);

      await Queue.add(CancellationMail.key, {
        order,
        recipient,
        delivery_man,
        description,
      });

      await order.destroy();
      // pode colocar nome do produto, endereço, algo mais detalhado
      return res.json({ message: 'Encomenda deletada' });
    } catch (err) {
      return res.status(400).json({ message: 'Ocorreu um erro.' });
    }
  }
}

export default new DeliveryProblemController();
