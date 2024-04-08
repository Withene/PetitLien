import dotenv from 'dotenv';
import EncurteLink from './EncurteLinkModel';
import schema from './_validate/create.validate';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class EncurteLinkController {
  async create(req, res) {
    const data = req.body;
    const { protocol, hostname } = req;

    const { error } = schema.validate(data);
    if (error) {
      return res.status(422).json({ err: true, message: error.details[0].message });
    }

    const createEncurteLink = await EncurteLink.create(data.url);

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
}

export default new EncurteLinkController();
