import { Category as CategoryMapping } from './mapping.js';
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
  async getAll() {
    const categories = await CategoryMapping.findAll({
      order: [['name', 'ASC']],
    });
    return categoryDTO(categories);
  }

  async create(data) {
    const { name, slug, parentId } = data;
    const exist = await CategoryMapping.findOne({
      where: { name },
    });

    if (exist) {
      throw new Error('Такая категория уже есть');
    }

    const category = await CategoryMapping.create({ name, slug, parentId });
    return category;
  }

  async update(id, data) {
    const category = await CategoryMapping.findByPk(id);
    if (!category) {
      throw new Error('Категория не найдена в БД');
    }
    const { name = category.name } = data;
    const { slug = category.slug } = data;
    const { parentId = category.parentId } = data;
    await category.update({ name, slug, parentId });
    return category;
  }

  async delete(id) {
    const category = await CategoryMapping.findByPk(id);
    if (!category) {
      throw new Error('Категория не найдена в БД');
    }

    await category.destroy();
    return category;
  }
}

export default new Category();
