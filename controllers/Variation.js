import VariationModel from '../models/Variation.js';
import AppError from '../errors/AppError.js';

class Variation {
  /*
  method: GET
  desc: get all variation
  */
  async getAllVariation(req, res, next) {
    try {
      const variation = await VariationModel.getAllVariation(
        req.params.productId
      );
      res.json(variation);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create variation
  */
  async createVariation(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const variation = await VariationModel.createVariation(
        req.body.productId,
        req.body
      );
      res.json(variation);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update variation
  */
  async updateVariation(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id варианта');
      }

      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const variation = await VariationModel.updateVariation(id, req.body);
      res.json(variation);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete variation
  */
  async deleteVariation(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id варианта');
      }

      const variation = await VariationModel.deleteVariation(id);
      res.json(variation);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create option
  */
  async createOptions(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const option = await VariationModel.createOption(
        req.body.productVariationId,
        req.body.productId,
        req.body,
        req.files?.image
      );
      res.json(option);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update option
  */
  async updateOption(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id опции');
      }

      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const option = await VariationModel.updateOption(
        id,
        req.body,
        req.files?.image
      );
      res.json(option);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete option
  */
  async deleteOption(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id опции');
      }

      const option = await VariationModel.deleteOption(id);
      res.json(option);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Variation();
