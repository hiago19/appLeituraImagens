import { Router } from 'express';
import { uploadController } from '../controllers/controller';

export const routes = Router();

routes.post('/upload', uploadController.uploadImage);
routes.patch('/confirm', uploadController.confirmMeasure);
routes.get('/:customer_code/list', uploadController.listMeasures);