import { Router } from 'express';
import { verify } from 'jsonwebtoken';
import EncurteLinkController from '../api/EncurteLink/EncuteLinkController';
import UserController from '../api/User/UserController';

const routes = Router();

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    req.user = null;
    return next();
  }
  const tokenWithReplace = token.replace('Bearer ', '');

  verify(tokenWithReplace, process.env.APP_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    req.user = decoded;

    return true;
  });
  return next();
}

routes.use(isAuthenticated);
/**
 * @swagger
 * /minify:
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
 * /{code}:
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

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided name, email, and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request
 */

routes.post('/user', UserController.create);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login with the provided email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Unauthorized - Invalid email or password
 */

routes.post('/login', UserController.login);

/**
 * @swagger
 * /minify/list:
 *   get:
 *     summary: List all shortened URLs by user
 *     description: List all shortened URLs created by the authenticated user
 *     responses:
 *       '200':
 *         description: A list of shortened URLs
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */

routes.get('/minify/list', EncurteLinkController.listAllByUser);

/**
 * @swagger
 * /minify/edit/{id}:
 *   put:
 *     summary: Edit the original URL of a shortened URL
 *     description: Edit the original URL of a shortened URL created by the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the shortened URL to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: The new URL to be associated with the shortened URL
 *     responses:
 *       '200':
 *         description: Shortened URL updated successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Shortened URL not found
 *       '500':
 *         description: Internal server error
 */

routes.put('/minify/edit/:id', EncurteLinkController.editOriginCtr);

/**
 * @swagger
 * /minify/delete/{id}:
 *   delete:
 *     summary: Delete a shortened URL
 *     description: Delete a shortened URL created by the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the shortened URL to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Shortened URL deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Shortened URL not found
 *       '500':
 *         description: Internal server error
 */
routes.delete('/minify/delete/:id', EncurteLinkController.destroyRedirect);

export default routes;
