import { Brand as BrandMapping } from '../models/mapping.js';
import AppError from '../errors/AppError.js';

class Brand {
  /*
  method: GET
  desc: get all brands
  */
  async getAll(req, res, next) {
    try {
      const brands = await BrandMapping.findAll();
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
      const brand = await BrandMapping.findByPk(id);
      if (!brand) {
        throw new Error('Бренд не найден в БД');
      }
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
      const brand = await BrandMapping.create({ name: req.body.name });
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
      const brand = await BrandMapping.findByPk(req.params.id);
      if (!brand) {
        throw new Error('Бренд не найден в БД');
      }
      const name = req.body.name ?? brand.name;
      await brand.update({ name });
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
      const brand = await BrandMapping.findByPk(req.params.id);
      if (!brand) {
        throw new Error('Бренд не найден в БД');
      }
      await brand.destroy();
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Brand();
