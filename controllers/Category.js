import CategoryModel from '../models/Category.js';
import AppError from '../errors/AppError.js';
import pkg from 'slugify';

class Category {
  /*
  method: GET
  desc: get all categories
  */
  async getAllCatAndSubCat(req, res, next) {
    try {
      const categories = await CategoryModel.getAllCategoryAndSubCategory();
      res.json(categories);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneCategory(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id категории');
      }

      const category = await CategoryModel.getOneCategory(id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create category and subcategory
  */
  async createCategory(req, res, next) {
    try {
      const categoryObj = {
        categoryName: req.body.categoryName,
      };

      const category = await CategoryModel.createCategory(categoryObj);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update category
  */
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id категории');
      }

      const categoryObj = {
        categoryName: req.body.categoryName,
      };

      const category = await CategoryModel.updateCategory(id, categoryObj);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete category
  */
  async deleteCategory(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new Error('Не указан id категории');
      }
      const category = await CategoryModel.deleteCategory(id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create subcategory
  */
  async createSubCategory(req, res, next) {
    try {
      const subCategoryObj = {
        subCategoryName: req.body.subCategoryName,
        categoryId: req.body.categoryId,
      };

      const subCategory = await CategoryModel.createSubCategory(subCategoryObj);
      res.json(subCategory);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update subcategory
  */
  async updateSubCategory(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id суб-категории');
      }

      const subCategoryObj = {
        subCategoryName: req.body.subCategoryName,
        CategoryId: req.body.categoryId,
      };

      const subCategory = await CategoryModel.updateSubCategory(
        id,
        subCategoryObj
      );
      res.json(subCategory);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete subcategory
  */
  async deleteSubCategory(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new Error('Не указан id суб-категории');
      }
      const subCategory = await CategoryModel.deleteSubCategory(id);
      res.json(subCategory);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Category();
