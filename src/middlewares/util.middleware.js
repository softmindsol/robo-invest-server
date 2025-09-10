import mongoose from 'mongoose';
import fs from 'fs';
const objectIdValidator = (param) => {
  return (req, res, next) => {
    const id = req.params[param];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Object ID.' });
    }
    req.param = id;
    next();
  };
};
const fileValidator = (message = '') => {
  return (req, res, next) => {
    if (req.files) {
      return res
        .status(400)
        .json({ error: 'No file uploaded or invalid content type', message });
    }
    next();
  };
};

const fileDelete = (name, destination) => {
  return (req, res) => {
    fs.unlink(`./public/${destination}/${name}`, (error) => {
      if (error)
        return res.status(400).json({ error: 'Failed to delete file' });
    });
  };
};

export const coerceMultipartJson =
  (keys = []) =>
  (req, _res, next) => {
    for (const k of keys) {
      const v = req.body?.[k];
      if (v === null) continue;
      if (typeof v === 'string') {
        try {
          req.body[k] = JSON.parse(v); // valid JSON text -> object/primitive
        } catch (e) {
          // if not JSON, leave as-is
          console.log(`coerceMultipartJson: key "${k}" is not valid JSON:`, e);
        }
      }
    }
    next();
  };

export { objectIdValidator, fileValidator, fileDelete };
