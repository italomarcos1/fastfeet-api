import Order from '../models/Order';
import Deliverymen from '../models/Deliverymen';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';

class OrderController {
  async store(req, res) {
    const { recipient_id, deliveryman_id } = req.body;

    const [deliveryman, recipient] = await Promise.all([
      Deliverymen.findByPk(deliveryman_id),
      Recipient.findByPk(recipient_id),
    ]);

    if (!deliveryman || !recipient) {
      return res.status(400).json({
        message: 'Não há um entregador ou produto registrado com esses dados.',
      });
    }

    const order = await Order.create(req.body);

    const dt = new Date();
    const date = dt.toISOString();

    await Queue.add(NewOrderMail.key, {
      date,
      deliveryman,
      recipient,
    });

    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.json(orders);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }

    if (order.canceled_at !== null || order.delivered === true) {
      return res
        .status(400)
        .json({ message: 'Não é mais permitido cancelar essa encomenda.' });
    }

    order.canceled_at = new Date();

    await order.save();

    return res.json({ message: 'Encomenda cancelada.' });
  }
}

export default new OrderController();
