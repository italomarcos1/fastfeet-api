import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymenController from './app/controllers/DeliverymenController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.post('/add', RecipientController.store);

routes.post('/register', DeliverymenController.store);
routes.get('/list', DeliverymenController.index);
routes.put('/update/:id', DeliverymenController.update);
routes.put('/delete/:id', DeliverymenController.delete);

routes.get('/deliverymen/:id/deliveries', DeliverymenController.delivered);
routes.put('/deliverymen/:id/retrieve/:order', DeliveryController.retrieve);
routes.put('/deliverymen/:id/deliver/:order', DeliveryController.deliver);

routes.post('/orders', OrderController.store);
routes.get('/orders/:id', OrderController.index);
routes.put('/deliver/:id', OrderController.update);
routes.delete('/deleteOrder/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/success', (req, res) => {
  return res.send('ronaldo');
});

export default routes;
