import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        number: Yup.string().required(),
        street: Yup.string().required(),
        complement: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
        cep: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ message: 'Preencha os dados corretamente.' });
      }

      const data = req.body;

      const { id, name, email, street, number } = await Recipient.create(data);

      return res.json({ id, name, email, street, number });
    } catch (err) {
      return res.status(400).json({ message: 'something went wrong' });
    }
  }
}

export default new RecipientController();
