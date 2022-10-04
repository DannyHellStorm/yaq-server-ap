import CategoryModel from '../models/Category.js';
import AppError from '../errors/AppError.js';

class Category {
  /*
  method: GET
  desc: get all categories
  */
  async getAll(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();
      res.json(categories);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get one category
  */
  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new Error('Не указан id категории');
      }
      const category = await CategoryModel.getOne(id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create category
  */
  async create(req, res, next) {
    try {
      const category = await CategoryModel.create(req.body);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update category
  */
  async update(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new Error('Не указан id категории');
      }
      const category = await CategoryModel.update(id, req.body);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete category
  */
  async delete(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new Error('Не указан id категории');
      }
      const category = await CategoryModel.delete(req.params.id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Category();
