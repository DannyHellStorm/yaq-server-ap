import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
} from './mapping.js';
import FileService from '../services/File.js';
import Sequelize from 'sequelize';
import AppError from '../errors/AppError.js';

const op = Sequelize.Op;

class Product {
  async getAll(options) {
    const { categoryId, brandId, limit, page } = params;
    const offset = (page - 1) * limit;
    const where = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (brandId) {
      where.brandId = brandId;
    }
    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
    });
    return products;
  }

  async getOne(id) {
    const product = await ProductMapping.findOne({
      where: { id: id },
      include: [{ model: ProductPropMapping }],
    });
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    return product;
  }

  async search(key) {
    const result = await ProductMapping.findAll({
      order: [['id', 'ASC']],
      where: {
        name: {
          [op.iLike]: '%' + key + '%',
        },
      },
    });

    if (!result) {
      throw new Error('Товар не найден в БД');
    }

    return result;
  }

  async create(data, img) {
    // поскольку image не допускает null, задаем пустую строку
    const image = FileService.save(img) ?? '';
    const { name, price, categoryId = null, brandId = null } = data;
    const product = await ProductMapping.create({
      name,
      price,
      image,
      categoryId,
      brandId,
    });

    if (data.props) {
      const props = JSON.parse(data.props);
      for (let prop of props) {
        await ProductPropMapping.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }
    return product;
  }

  async update(id, data, img) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    // пробуем сохранить изображение, если оно было загружено
    const file = FileService.save(img);
    // если загружено новое изображение — надо удалить старое
    if (file && product.image) {
      FileService.delete(product.image);
    }
    // подготавливаем данные, которые надо обновить в базе данных
    const {
      name = product.name,
      price = product.price,
      categoryId = product.categoryId,
      brandId = product.brandId,
      image = file ? file : product.image,
    } = data;
    await product.update({ name, price, image, categoryId, brandId });
    return product;
  }

  async delete(id) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    await product.destroy();
    return product;
  }
}

export default new Product();
