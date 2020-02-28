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

    if (!order || order.canceled_at !== null) {
      return res
        .status(400)
        .json({ message: 'Essa encomenda não existe ou foi cancelada.' });
    }

    if (order.start_date === null || order.delivered === true) {
      return res.status(400).json({
        message:
          'A encomenda não está elegível para cadastrar problemas (não foi retirada ou já foi cancelada pelo comprador.',
      });
    }

    const { id } = await DeliveryProblem.create({ delivery_id, description });

    return res.json({ id, description, order });
  }

  async index(req, res) {
    const problems = await DeliveryProblem.findAll();
    if (!problems) {
      return res.status(400).json({
        message: 'Nenhuma issue foi encontrada.',
      });
    }
    return res.json(problems);
  }

  async indexUnsolved(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: { solved_at: null },
    });
    if (!problems) {
      return res.status(400).json({
        message: 'Nenhuma issue aberta foi encontrada.',
      });
    }
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

      if (order.start_date === null || order.delivered === true) {
        return res.status(400).json({
          message:
            'Não é possível cancelar uma encomenda não-retirada ou que já foi entregue.',
        });
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
      const { product } = order;

      order.canceled_at = new Date();

      await order.save();

      return res.json({
        message: `A encomenda referente ao produto ${product} foi cancelada.`,
      });
    } catch (err) {
      return res.status(400).json({ message: 'Ocorreu um erro.' });
    }
  }

  async closeIssue(req, res) {
    try {
      const issue = await DeliveryProblem.findByPk(req.params.id);

      if (!issue || issue.solved_at !== null) {
        return res.status(400).json({
          message:
            'A issue não foi encontrada. Provavelmente já foi resolvida.',
        });
      }

      const { delivery_id, description } = issue;

      const order = await Order.findOne({ where: { id: delivery_id } });

      if (!order) {
        return res.status(400).json({ message: 'Essa encomenda não existe.' });
      }

      const { recipient_id, deliveryman_id } = order;

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

      const { product } = order;

      order.canceled_at = new Date();

      await order.save();

      return res.json({
        message: `A encomenda referente ao produto ${product} foi cancelada.`,
      }); // coloca encomenda como cancelada e issue como solved, e no description algo como 'encomenda cancelada'
      // pode colocar nome do produto, endereço, algo mais detalhado
    } catch (err) {
      return res.status(400).json({ message: 'Ocorreu um erro.' });
    }
  }
}

export default new DeliveryProblemController();
