import BaseLink from '../../models/BaseLink';
import Redirect from '../../models/RedirectLink';

class EncurteLinkModel {
  async create(url) {
    try {
      const existSameLinkOnStorage = await BaseLink
        .findOne({ where: { originLink: url } });

      let urlId = null;
      if (existSameLinkOnStorage) {
        urlId = existSameLinkOnStorage.dataValues.id;
      } else {
        const newRegister = await BaseLink.create({ originLink: url });
        urlId = newRegister.dataValues.id;
      }

      const redirectCodeRegister = await Redirect.create({
        encurtedLink: this.generateRandomCode(),
        BaseLinkId: urlId,
      });

      return redirectCodeRegister.dataValues.encurtedLink;
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
}

export default new EncurteLinkModel();
