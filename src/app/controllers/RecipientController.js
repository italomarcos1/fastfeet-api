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

      const { name, street, number, cep } = req.body;

      const alreadyExists = await Recipient.findOne({
        where: { name, street, number, cep },
      });

      if (alreadyExists) {
        return res
          .status(400)
          .json({ message: 'Esse destinatário já foi cadastrado.' });
      }

      const { id } = await Recipient.create(req.body);

      return res.json({ id, name, street, number });
    } catch (err) {
      return res.status(400).json({ message: 'something went wrong' });
    }
  }
}

export default new RecipientController();
