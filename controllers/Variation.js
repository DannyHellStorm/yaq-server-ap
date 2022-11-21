import VariationModel from '../models/Variation.js';
import AppError from '../errors/AppError.js';

class Variation {
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
}

export default new Variation();
