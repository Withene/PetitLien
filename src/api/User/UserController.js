import dotenv from 'dotenv';
import UserModel from './UserModel';
import schema from './_validate/create.validate';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class UserController {
  async create(req, res) {
    const data = req.body;

    const { error } = schema.validate(data);
    if (error) {
      return res.status(422).json({ err: true, message: error.details[0].message });
    }

    const createUser = await UserModel.create(data.name, data.email, data.password);

    if (createUser.err && createUser.err === true) {
      return res.status(400).json(createUser);
    }

    return res.status(200).json(createUser);
  }

  async login(req, res) {
    const data = req.body;

    const Auth = await UserModel.Login(data.email, data.password);
    if (Auth.erro === true) {
      return res.status(400).json(Auth);
    }
    return res.status(200).json(Auth);
  }
}

export default new UserController();
