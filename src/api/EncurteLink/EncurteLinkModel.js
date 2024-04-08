import BaseLink from '../../models/BaseLink';
import Redirect from '../../models/RedirectLink';
import { sequelize } from '../../config/sequelize';

class EncurteLinkModel {
  async create(url, user = null) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const existSameLinkOnStorage = await BaseLink.findOrCreate({
          where: { originLink: url },
          transaction: t,
        });

        let urlId;
        if (existSameLinkOnStorage) {
          urlId = existSameLinkOnStorage[0].dataValues.id;
        }

        const objToSave = {
          encurtedLink: this.generateRandomCode(),
          BaseLinkId: urlId,
        };

        if (user && user.id) {
          objToSave.UserId = user.id;
        }

        const redirectCodeRegister = await Redirect.create(objToSave, { transaction: t });

        return redirectCodeRegister.dataValues.encurtedLink;
      });

      return result;
    } catch (error) {
      return { err: true, message: error.message };
    }
  }

  generateRandomCode() {
    const length = Math.floor(Math.random() * 3) + 4;
    let result = '';
    for (let i = 0; i < length; i++) {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        result += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      } else if (type === 1) {
        result += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      } else {
        result += Math.floor(Math.random() * 10);
      }
    }
    return result;
  }

  async searchByCode(code) {
    try {
      const urlToRedirect = await Redirect.findOne({
        where: { encurtedLink: code },
        hookOptions: { needIncrementAccess: true },
        include: [{
          model: BaseLink,
          as: 'BaseLink',
        }],
      });

      if (!urlToRedirect) {
        throw new Error('Sorry, your URL is not in the database or your encurted url is deleted');
      }

      const { BaseLink: { originLink } } = urlToRedirect;
      return originLink;
    } catch (error) {
      return { err: true, message: error.message };
    }
  }

  async listAllByUser(user, protocol, hostname) {
    if (user && user.id) {
      try {
        const urls = await Redirect.findAll({
          where: { UserId: user.id },
          include: [{
            model: BaseLink,
            as: 'BaseLink',
            attributes: ['originLink'],
          }],
          raw: true,
        });

        const formattedUrls = urls.map((m) => {
          const encurtedLink = `${protocol}://${hostname}/${m.encurtedLink}`;
          const orginalLink = m['BaseLink.originLink'];
          // eslint-disable-next-line no-param-reassign
          delete m['BaseLink.originLink'];
          return { ...m, encurtedLink, orginalLink };
        });

        return formattedUrls;
      } catch (error) {
        return { err: true, message: error.message };
      }
    }
    return true;
  }

  async editOriginLink(newUrl, id, user) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const existSameLinkOnStorage = await BaseLink.findOrCreate({
          where: { originLink: newUrl },
          transaction: t,
        });

        let urlId;
        if (existSameLinkOnStorage) {
          urlId = existSameLinkOnStorage[0].dataValues.id;
        }

        const instanceOfRedirect = await Redirect.findOne({
          where: { UserId: user, id },
          transaction: t,
        });

        instanceOfRedirect.BaseLinkId = urlId;
        await instanceOfRedirect.save({ transaction: t });

        return instanceOfRedirect;
      });

      return result;
    } catch (error) {
      return { err: true, message: error.message };
    }
  }

  async removeRedirectLink(id, user) {
    try {
      const destroyRedirect = await Redirect.destroy({ where: id, UserId: user });

      return destroyRedirect;
    } catch (error) {
      return { err: true, message: error.message };
    }
  }
}

export default new EncurteLinkModel();
