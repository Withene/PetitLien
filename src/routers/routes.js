import { Router } from 'express';
import EncurteLinkController from '../api/EncurteLink/EncuteLinkController';

const routes = Router();

routes.post('/minify', EncurteLinkController.create);
routes.get('/:code', EncurteLinkController.redirect);

export default routes;
