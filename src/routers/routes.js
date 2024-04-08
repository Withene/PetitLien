import { Router } from 'express';
import EncurteLinkController from '../api/EncurteLink/EncuteLinkController';

const routes = Router();

/**
 * @swagger
 * /api/minify:
 *   post:
 *     summary: Create a new shortened url
 *     description: Create a new shortened url
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The url to be shortened
 *     responses:
 *       '201':
 *         description: Successfully shortened URL with url shortened
 *       '422':
 *         description: Bad request
 */
routes.post('/minify', EncurteLinkController.create);

/**
 * @swagger
 * /api/{code}:
 *   x-swagger-router-controller: false
 *   get:
 *     summary: Redirect to the URL
 *     description: Redirect to the URL stored in the database based on the provided code
 *     parameters:
 *       - in: path
 *         name: code
 *         description: The code used to find in database
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '302':
 *         description: Redirect to the URL
 *       '404':
 *         description: URL not found
 */
routes.get('/:code', EncurteLinkController.redirect);

export default routes;
