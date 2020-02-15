import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ message: 'Preencha os dados corretamente.' });
    }

    const employee = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (employee) {
      return res
        .status(400)
        .json({ message: 'Já existe um entregador registrado com esse email' });
    }

    const { id, name, email, avatar_id } = await employee.create(req.body);
    return res.json({ id, name, email, avatar_id });
  }
}

export default new DeliverymanController();
