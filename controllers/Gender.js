import GenderModel from '../models/Gender.js';
import AppError from '../errors/AppError.js';

class Gender {
  /*
  method: GET
  desc: get all genders
  */
  async getAll(req, res, next) {
    try {
      const genders = await GenderModel.getAll();
      res.json(genders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get one gender
  */
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Не указан id пола');
      }

      const gender = await GenderModel.getOne(id);
      res.json(gender);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create gender
  */
  async create(req, res, next) {
    try {
      const gender = await GenderModel.create(req.body);
      res.json(gender);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update gender
  */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Не указан id пола');
      }

      const gender = await GenderModel.update(id, req.body);
      res.json(gender);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete gender
  */
  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пола');
      }

      const gender = await GenderModel.delete(req.params.id);
      res.json(gender);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Gender();
