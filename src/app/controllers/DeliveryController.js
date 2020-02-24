import {
  getHours,
  parseISO,
  setHours,
  addHours,
  isBefore,
  // format,
  isAfter,
} from 'date-fns';
// import pt from 'date-fns/locale/pt';

import Deliverymen from '../models/Deliverymen';
import File from '../models/File';
import Order from '../models/Order';

class DeliveryController {
  async retrieve(req, res) {
    const [deliveryman, order] = await Promise.all([
      Deliverymen.findByPk(req.params.id, {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'name', 'path', 'url'],
          },
        ],
      }),
      Order.findByPk(req.params.order),
    ]);

    if (!order) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }

    if (order.start_date !== null) {
      return res
        .status(400)
        .json({ message: 'Esta encomenda já foi retirada.' });
    }

    const minimal = addHours(deliveryman.on_duty, 24);
    if (isAfter(minimal, new Date())) {
      deliveryman.retrieved = 0;
    }

    if (deliveryman.retrieved >= 5) {
      return res.status(400).json({
        message: 'O entregador atingiu o limite de encomendas diárias.',
      });
    }

    const { start_date } = req.body;

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

    deliveryman.retrieved++; // so pode retirar quando eh null

    await Promise.all([order.update({ start_date }), deliveryman.save()]);

    const { avatar } = deliveryman;
    const { id, product, recipient_id } = order;

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id: deliveryman.id,
      avatar,
    });
  }

  async deliver(req, res) {
    const order = await Order.findByPk(req.params.order);

    if (!order) {
      return res.status(400).json({ message: 'Essa encomenda não existe.' });
    }
    const { end_date } = req.body; // mexer no end

    // incluir arquivo - passa um id qualquer. no front, habilita a camera do react native
    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      start_date,
    } = await order.update({
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

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
      avatar,
      start_date,
      end_date,
    });
  }
}

export default new DeliveryController();
