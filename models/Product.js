import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
  Brand as BrandMapping,
  Category as CategoryMapping,
  Color as ColorMapping,
  Size as SizeMapping,
  SubCategory as SubCategoryMapping,
  ProductVariations as ProductVariationsMapping,
  ProductVarOptions as ProductVarOptionsMapping,
  Gender as GenderMapping,
} from './mapping.js';
import FileService from '../services/File.js';
import Sequelize from 'sequelize';
import pkg from 'slugify';

const op = Sequelize.Op;

class Product {
  async getAllProductsByFilter(page, limit, data) {
    const offset = (page - 1) * limit;

    const {
      minPrice,
      maxPrice,
      subCategoryId = null,
      colorId = null,
      brandId = null,
      genderId = null,
    } = data;

    const products = await ProductMapping.findAll({
      limit,
      offset,
      where: {
        [op.or]: [{ subCategoryId }, { colorId }, { brandId }, { genderId }],
        price: {
          [op.between]: [minPrice, maxPrice],
        },
      },
      include: [
        { model: CategoryMapping },
        { model: SubCategoryMapping },
        {
          model: ProductVariationsMapping,
          include: [
            {
              model: ProductVarOptionsMapping,
            },
          ],
        },
        { model: ProductPropMapping, as: 'props' },
      ],
    });

    return products;
  }

  async getProductsByCategory(data) {
    const { categoryId } = data;

    let where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await ProductMapping.findAll({
      where,
      include: [
        {
          model: ProductVariationsMapping,
          include: [
            {
              model: ProductVarOptionsMapping,
            },
          ],
        },
        { model: SubCategoryMapping },
        { model: CategoryMapping },
      ],
    });

    return products;
  }

  async getProductsBySubCategory(data) {
    const { subCategoryId } = data;

    let where = {};

    if (subCategoryId) {
      where.subCategoryId = subCategoryId;
    }

    const products = await ProductMapping.findAll({
      where,
      include: [
        {
          model: ProductVariationsMapping,
          include: [
            {
              model: ProductVarOptionsMapping,
            },
          ],
        },
        { model: SubCategoryMapping },
        { model: CategoryMapping },
      ],
    });

    return products;
  }

  async getProductsByName(productName) {
    let where = {};

    if (productName) {
      where.productName = productName;
    }

    const products = await ProductMapping.findAll({
      where,
      include: [
        {
          model: ProductVariationsMapping,
          include: [
            {
              model: ProductVarOptionsMapping,
            },
          ],
        },
        { model: SubCategoryMapping },
        { model: CategoryMapping },
      ],
    });

    return products;
  }

  async getOne(id) {
    const product = await ProductMapping.findByPk(id, {
      include: [
        { model: ProductPropMapping, as: 'props' },
        { model: BrandMapping, as: 'brand' },
        { model: CategoryMapping, as: 'category' },
        { model: ColorMapping, as: 'color' },
        { model: SizeMapping, as: 'size' },
      ],
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

  async create(data) {
    const {
      productName,
      product_code,
      categoryId = null,
      subCategoryId = null,
      brandId = null,
      genderId = null,
      colorId = null,
      price,
    } = data;

    let productSlug;

    if (productName) {
      productSlug = pkg(productName);
    }

    let gender = await GenderMapping.findOne({
      where: { id: genderId },
    });

    let brand = await BrandMapping.findOne({
      where: { id: brandId },
    });

    let color = await ColorMapping.findOne({
      where: { id: colorId },
    });

    let category = await CategoryMapping.findOne({
      where: { id: categoryId },
    });

    let subCategory = await SubCategoryMapping.findOne({
      where: { id: subCategoryId },
    });

    const product = await ProductMapping.create({
      productName,
      productSlug,
      product_code,
      subCategoryName: subCategory.subCategoryName,
      categoryName: category.categoryName,
      categoryId,
      subCategoryId,
      brandId,
      colorId,
      genderId,
      brandName: brand.brandName,
      genderName: gender.genderName,
      colorName: color.colorName,
      price,
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

    const created = await ProductMapping.findOne({
      where: {
        id: product.id,
      },
      include: [{ model: ProductPropMapping, as: 'props' }],
    });

    return created;
  }

  async update(id, data, img) {
    const product = await ProductMapping.findByPk(id, {
      include: [{ model: ProductPropMapping, as: 'props' }],
    });

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
      sizeId = product.sizeId,
      colorId = product.colorId,
      image = file ? file : product.image,
    } = data;

    await product.update({
      name,
      price,
      image,
      categoryId,
      brandId,
      sizeId,
      colorId,
    });

    if (data.props) {
      await ProductPropMapping.destroy({ where: { productId: id } });
      const props = JSON.parse(data.props);
      for (let prop of props) {
        await ProductPropMapping.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }

    await product.reload();
    return product;
  }

  async delete(id) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error('Товар не найден в БД');
    }

    if (product.image) {
      FileService.delete(product.image);
    }

    await product.destroy();
    return product;
  }

  async isExist(id) {
    const basket = await ProductMapping.findByPk(id);
    return basket;
  }
}

export default new Product();
