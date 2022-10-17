import SizeModel from '../models/Size.js';
import AppError from '../errors/AppError.js';

class Size {
  async getAll(req, res, next) {
    try {
      const sizes = await SizeModel.getAll();
      res.json(sizes);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id размера');
      }

      const size = await SizeModel.getOne(req.params.id);
      res.json(size);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const size = await SizeModel.create(req.body);
      res.json(size);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id размера');
      }

      const size = await SizeModel.update(req.params.id, req.body);
      res.json(size);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id размера');
      }

      const size = await SizeModel.delete(req.params.id);
      res.json(size);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Size();
