import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'; // instale a @date-fns
import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import Deliverymen from '../models/Deliverymen';

class OrderController {
  async store(req, res) {
    const { start_date, recipient_id, deliveryman_id, product_id } = req.body;

    const itExists = await Deliverymen.findByPk(deliveryman_id);

    if (!itExists) {
      return res
        .status(400)
        .json({ message: 'Não há um entregador registrado com esses dados.' });
    }

    const hourStart = startOfHour(parseISO(start_date));

    console.log(new Date().setHours(8));
    return res.json(hourStart);
  }
}

export default new OrderController();
