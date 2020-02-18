import {
  getHours,
  parseISO,
  setHours,
  isBefore,
  format,
  isAfter,
} from 'date-fns'; // instale a @date-fns
import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import File from '../models/File';
import Deliverymen from '../models/Deliverymen';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';

class OrderController {
  async store(req, res) {
    const { start_date, recipient_id, deliveryman_id } = req.body;

    const deliveryman = await Deliverymen.findByPk(deliveryman_id);
    const recipient = await Recipient.findByPk(recipient_id);

    if (!deliveryman || !recipient) {
      return res.status(400).json({
        message: 'Não há um entregador ou produto registrado com esses dados.',
      });
    }

    const hourStart = getHours(parseISO(start_date));

    const minHour = getHours(setHours(new Date(), 8)); // coloca pro fuso do pais - horario
    const maxHour = getHours(setHours(new Date(), 18)); // coloca pro fuso do pais - horario
    // adicionar timezone
    // devo passar o valor com tz 0 ou do país? olhe o gbw

    if (isBefore(hourStart, minHour) || isAfter(hourStart, maxHour)) {
      return res.status(400).json({
        message: 'Não é permitido retirar encomendas no horário atual.',
      });
    }

    const order = await Order.create(req.body);

    await Queue.add(NewOrderMail.key, { order, deliveryman, recipient });

    return res.json(order);
  }

  async update(req, res) {
    // recebe pelo route param
    const count = 0; // salvo no banco e resetado ao fim do dia
    const order = await Order.findByPk(req.params.id);

    if (!order || count > 5) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }
    const { end_date } = req.body;

    // colocar a opção de cancelar a entrega.
    // o front deve ter um botao cancel e um deliver
    // incluir arquivo - passa um id qualquer. no front, habilita a camera do react native
    const { id, recipient_id, deliveryman_id, product } = await order.update({
      end_date,
      delivered: true,
    });

    const { avatar } = await Deliverymen.findByPk(deliveryman_id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });
    console.log(count);
    return res.json({ id, product, recipient_id, deliveryman_id, avatar });
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
    // cancelar significa SET NULL ou apagar do banco?
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }

    order.canceled_at = new Date();

    await order.save();

    return res.json({ message: 'Encomenda cancelada.' });
  }
}

export default new OrderController();
