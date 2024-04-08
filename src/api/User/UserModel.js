import isEmail from 'validator/lib/isEmail';
import UserModel from '../../models/User';

class User {
  async create(name, email, password) {
    let verifyDates = await this.validator(email, password);
    if (name === undefined || name === null) {
      verifyDates = true;
    }

    if (verifyDates !== true) {
      const verify = await this.VerifyEmail(email);

      if (verify !== true) {
        const user = await UserModel.create({
          name,
          email,
          password_hash: password,
        });
        const Usereturn = {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        return { err: false, message: 'Create User Sucessful', user: Usereturn };
      }
      return { err: true, message: 'Email already exist' };
    }
    return { err: true, message: 'Missing Credetials' };
  }

  async VerifyEmail(email) {
    const user = await UserModel.findOne({
      where: {
        email,
      },
    });
    if (user !== null) {
      return true;
    }
    return false;
  }

  async validator(email, password) {
    if (email === undefined || email == null) {
      return true;
    }
    if (password === undefined || password == null) {
      return true;
    }

    if (isEmail(email) === false) {
      return true;
    }
    return false;
  }

  async Login(email, password) {
    const verifyDates = await this.validator(email, password);

    const verify = await this.VerifyEmail(email);
    if (verify !== false) {
      if (verifyDates !== true) {
        const user = await UserModel.findOne({
          where: {
            email,
          },
        });
        const checkPassword = await user.checkPassword(password);
        if (checkPassword === true) {
          const createToken = await user.generateToken();
          return {
            err: false, message: 'Sucessful', token: createToken,
          };
        }
        return { err: true, message: 'Credentials Error' };
      }
      return { err: true, message: 'Credentials Error' };
    }
    return { err: true, message: 'Credentials Error' };
  }
}

export default new User();
