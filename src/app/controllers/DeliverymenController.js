import * as Yup from 'yup';
import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  parseISO,
} from 'date-fns';

import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
      password: Yup.string()
        .required()
        .min(6),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ message: 'Preencha os dados corretamente.' });
    }

    const itExists = await Deliverymen.findOne({
      where: { email: req.body.email },
    });

    if (itExists) {
      return res
        .status(400)
        .json({ message: 'Já existe um entregador registrado com esse email' });
    }

    const date = new Date(); // fazer em uma linha ou optimizar
    const duty = date.toISOString(); // fazer em uma linha ou optimizar
    console.log(date);
    console.log(duty);
    const on_duty = setHours(
      setMinutes(setSeconds(setMilliseconds(parseISO(duty), 0), 0), 0),
      8
    );

    console.log(req.body.on_duty);
    req.body.on_duty = on_duty;
    console.log(req.body.on_duty);

    const { id, name, email, avatar_id } = await Deliverymen.create(req.body);
    return res.json({ id, name, email, avatar_id, on_duty });
  }

  async index(req, res) {
    const employees = await Deliverymen.findAll({
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(employees);
  }

  async update(req, res) {
    const employee = await DeliverymanController.findByPk(req.params.id);

    const { id, name, email } = await employee.update(req.body);
    // fazer a validação pra alterar senha
    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const employee = await DeliverymanController.findByPk(req.params.id);

    await employee.destroy();

    return res.send('Entregador deletado da base de dados.');
  }

  async delivered(req, res) {
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        delivered: true,
      },
      include: [
        {
          model: Deliverymen,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  }
}

export default new DeliverymanController();
