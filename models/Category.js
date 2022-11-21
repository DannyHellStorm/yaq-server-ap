import {
  Category as CategoryMapping,
  Product as ProductMapping,
  SubCategory as SubCategoryMapping,
} from './mapping.js';
import Sequelize from 'sequelize';
const op = Sequelize.Op;

function categoryDTO(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (Array.isArray(categories)) {
    if (parentId == null) {
      category = categories.filter((cat) => cat.parentId == undefined);
    } else {
      category = categories.filter((cat) => cat.parentId == parentId);
    }
  }

  for (let item of category) {
    categoryList.push({
      id: item.id,
      name: item.name,
      slug: item.slug,
      children: categoryDTO(categories, item.id),
    });
  }

  return categoryList;
}

class Category {
  async getAllCategoryAndSubCategory() {
    const categories = await CategoryMapping.findAndCountAll({
      order: [['categoryName', 'ASC']],
      include: [
        {
          model: SubCategoryMapping,
          attributes: ['id', 'subCategoryName'],
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
          attributes: ['id', 'subCategoryName'],
          as: 'subCategories',
        },
      ],
    });

    return category;
  }

  async createCategory(categoryData) {
    const { categoryName } = categoryData;

    const existCat = await CategoryMapping.findOne({
      where: { categoryName },
    });

    if (existCat) {
      throw new Error('Такая категория уже есть');
    }

    const category = await CategoryMapping.create({ categoryName });

    return category;
  }

  async updateCategory(id, data) {
    const category = await CategoryMapping.findByPk(id);

    if (!category) {
      throw new Error('Категория не найдена в БД');
    }
    const { categoryName = category.categoryName } = data;
    await category.update({ categoryName });
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

    await SubCategoryMapping.create({
      subCategoryName,
      CategoryId: categoryId,
    });

    const result = await CategoryMapping.findOne({
      where: {
        id: categoryId,
      },
      include: [
        {
          model: SubCategoryMapping,
          attributes: ['id', 'subCategoryName'],
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

    const { subCategoryName = subCategory.subCategoryName } = data;
    const { CategoryId = subCategory.CategoryId } = data;

    await subCategory.update({ subCategoryName, CategoryId });
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
