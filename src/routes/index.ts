import { Router } from 'express';
import uploadRoute from './upload';

const routes = Router();

routes.use('/upload', uploadRoute);

export default routes;
