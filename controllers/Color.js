import ColorModel from '../models/Color.js';
import AppError from '../errors/AppError.js';

class Color {
  async getAll(req, res, next) {
    try {
      const colors = await ColorModel.getAll();
      res.json(colors);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Не указан id цвета');
      }

      const color = await ColorModel.getOne(id);
      res.json(color);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const color = await ColorModel.create(req.body);
      res.json(color);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Не указан id цвета');
      }

      const color = await ColorModel.update(id, req.body);
      res.json(color);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id цвета');
      }

      const color = await ColorModel.delete(req.params.id);
      res.json(color);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Color();
