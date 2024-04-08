import dotenv from 'dotenv';
import EncurteLink from './EncurteLinkModel';
import schema from './_validate/create.validate';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class EncurteLinkController {
  async create(req, res) {
    const data = req.body;

    const { protocol, hostname, user } = req;

    const { error } = schema.validate(data);
    if (error) {
      return res.status(422).json({ err: true, message: error.details[0].message });
    }

    const createEncurteLink = await EncurteLink.create(data.url, user);

    if (createEncurteLink.err && createEncurteLink.err === true) {
      return res.status(400).json(createEncurteLink);
    }

    return res.status(200).json({ sucess: true, encutedLink: `${protocol}://${hostname}/${createEncurteLink}` });
  }

  async redirect(req, res) {
    const { code } = req.params;
    const originalLink = await EncurteLink.searchByCode(code);

    if (originalLink.err && originalLink.err === true) {
      return res.status(404).send(originalLink);
    }

    return res.status(302).redirect(originalLink);
  }

  async listAllByUser(req, res) {
    const { protocol, hostname, user } = req;

    if (user === null) {
      return res.status(401).json({ err: 'This route is only able only with token.' });
    }

    const originalLink = await EncurteLink.listAllByUser(user, protocol, hostname);

    if (originalLink.err && originalLink.err === true) {
      return res.status(404).send(originalLink);
    }

    return res.status(200).json(originalLink);
  }

  async editOriginCtr(req, res) {
    const { user, params: { id } } = req;
    const data = req.body;

    if (user === null) {
      return res.status(401).json({ err: 'This route is only able only with token.' });
    }

    const { error } = schema.validate(data);
    if (error) {
      return res.status(422).json({ err: true, message: error.details[0].message });
    }

    const originalLink = await EncurteLink.editOriginLink(data.url, id, user.id);

    if (originalLink.err && originalLink.err === true) {
      return res.status(404).send(originalLink);
    }

    return res.status(200).json(originalLink);
  }

  async destroyRedirect(req, res) {
    const { user, params: { id } } = req;

    if (user === null) {
      return res.status(401).json({ err: 'This route is only able only with token.' });
    }

    const originalLink = await EncurteLink.removeRedirectLink(id, user.id);

    if (originalLink.err && originalLink.err === true) {
      return res.status(404).send(originalLink);
    }

    return res.status(200).json(originalLink);
  }
}

export default new EncurteLinkController();
