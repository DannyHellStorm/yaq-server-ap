import BrandModel from '../models/Brand.js';
import AppError from '../errors/AppError.js';

class Brand {
  /*
  method: GET
  desc: get all brands
  */
  async getAll(req, res, next) {
    try {
      const brands = await BrandModel.getAll();
      res.json(brands);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get one brand
  */
  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new Error('Не указан id бренда');
      }

      const brand = await BrandModel.getOne(id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create brand
  */
  async create(req, res, next) {
    try {
      const brand = await BrandModel.create(req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update brand
  */
  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id бренда');
      }

      const brand = await BrandModel.update(req.params.id, req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete brand
  */
  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id бренда');
      }

      const brand = await BrandModel.delete(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Brand();
