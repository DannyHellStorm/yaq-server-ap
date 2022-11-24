import {
  Category as CategoryMapping,
  SubCategory as SubCategoryMapping,
} from './mapping.js';
import pkg from 'slugify';

class Category {
  async getAllCategoryAndSubCategory() {
    const categories = await CategoryMapping.findAndCountAll({
      order: [['categoryName', 'ASC']],
      include: [
        {
          model: SubCategoryMapping,
          attributes: ['id', 'subCategoryName', 'subCategorySlug'],
          as: 'subCategories',
        },
      ],
    });

    return categories;
  }

  async getOneCategory(id) {
    const category = await CategoryMapping.findOne({
      where: {
        id,
      },
      include: [
        {
          model: SubCategoryMapping,
          attributes: ['id', 'subCategoryName', 'subCategorySlug'],
          as: 'subCategories',
        },
      ],
    });

    return category;
  }

  async createCategory(categoryData) {
    const { categoryName } = categoryData;

    let categorySlug;

    if (categoryName) {
      categorySlug = pkg(categoryName);
    }

    const category = await CategoryMapping.create({
      categoryName,
      categorySlug,
    });

    return category;
  }

  async updateCategory(id, data) {
    const category = await CategoryMapping.findByPk(id);

    if (!category) {
      throw new Error('Категория не найдена в БД');
    }

    const { categoryName = category.categoryName } = data;

    let categorySlug;

    if (categoryName) {
      categorySlug = pkg(categoryName);
    }

    await category.update({ categoryName, categorySlug });
    return category;
  }

  async deleteCategory(id) {
    const category = await CategoryMapping.findByPk(id);

    if (!category) {
      throw new Error('Категория не найдена в БД');
    }

    await category.destroy();
    return category;
  }

  async createSubCategory(subCategoryData) {
    const { subCategoryName, categoryId } = subCategoryData;
    const existSubCat = await SubCategoryMapping.findOne({
      where: { subCategoryName },
    });

    if (existSubCat) {
      throw new Error('Такая суб-категория уже есть');
    }

    let subCategorySlug;

    if (subCategoryName) {
      subCategorySlug = pkg(subCategoryName);
    }

    await SubCategoryMapping.create({
      subCategoryName,
      categoryId,
      subCategorySlug,
    });

    const result = await CategoryMapping.findOne({
      where: {
        id: categoryId,
      },
      include: [
        {
          model: SubCategoryMapping,
          attributes: ['id', 'subCategoryName', 'subCategorySlug'],
          as: 'subCategories',
        },
      ],
    });

    return result;
  }

  async updateSubCategory(id, data) {
    const subCategory = await SubCategoryMapping.findByPk(id);

    if (!subCategory) {
      throw new Error('Суб-категория не найдена в БД');
    }

    const {
      subCategoryName = subCategory.subCategoryName,
      categoryId = subCategory.categoryId,
    } = data;

    let subCategorySlug;

    if (subCategoryName) {
      subCategorySlug = pkg(subCategoryName);
    }

    await subCategory.update({ subCategoryName, categoryId, subCategorySlug });

    return subCategory;
  }

  async deleteSubCategory(id) {
    const subCategory = await SubCategoryMapping.findByPk(id);

    if (!subCategory) {
      throw new Error('Суб-категория не найдена в БД');
    }

    await subCategory.destroy();
    return subCategory;
  }
}

export default new Category();
