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
import Sequelize from 'sequelize';
import pkg from 'slugify';

const op = Sequelize.Op;

class Product {
  async getAllProductsByFilter(page, limit, data) {
    const offset = (page - 1) * limit;

    const {
      price,
      categoryId,
      subCategoryId,
      colorId,
      brandId,
      genderId,
      sortByMaxPrice,
      sortByNewDate,
      sortBySale,
    } = data;

    const where = {};

    if (categoryId) where.categoryId = categoryId;
    if (subCategoryId) where.subCategoryId = subCategoryId;
    if (colorId) where.colorId = colorId;
    if (brandId) where.brandId = brandId;
    if (genderId) where.genderId = genderId;
    if (price) {
      where.price = { [op.between]: price };
    }

    if (sortByMaxPrice === false) {
      const products = await ProductMapping.findAll({
        // limit,
        // offset,
        where,
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
        order: [['price', 'ASC']],
      });

      return products;
    } else if (sortByMaxPrice === true) {
      const products = await ProductMapping.findAll({
        // limit,
        // offset,
        where,
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
        order: [['price', 'DESC']],
      });

      return products;
    } else if (sortByNewDate === true) {
      const products = await ProductMapping.findAll({
        // limit,
        // offset,
        where,
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
        order: [['updatedAt', 'DESC']],
      });

      return products;
    } else if (sortBySale === true) {
      const products = await ProductMapping.findAll({
        // limit,
        // offset,
        where,
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
        order: [['updatedAt', 'DESC']],
      });

      return products;
    } else {
      const products = await ProductMapping.findAll({
        // limit,
        // offset,
        where,
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
  }

  async getProductsByCategory(data) {
    const { categoryId, categoryName, genderId } = data;

    let where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (categoryName) {
      where.categoryName = categoryName;
    }
    if (genderId) {
      where.genderId = genderId;
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
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    return product;
  }

  async search(key) {
    const result = await ProductMapping.findAll({
      order: [['id', 'ASC']],
      where: {
        productName: {
          [op.iLike]: '%' + key + '%',
        },
      },
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
      inSale,
      salePrice,
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
      inSale,
      salePrice,
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

    return created;
  }

  async update(id, data) {
    const product = await ProductMapping.findByPk(id, {
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

    if (!product) {
      throw new Error('Товар не найден в БД');
    }

    const {
      productName = product.productName,
      price = product.price,
      categoryId = product.categoryId,
      subCategoryId = product.subCategoryId,
      brandId = product.brandId,
      genderId = product.genderId,
      colorId = product.colorId,
      inSale = product.inSale,
      salePrice = product.salePrice,
      product_code = product.product_code,
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

    await product.update({
      productName,
      productSlug,
      product_code,
      price,
      inSale,
      salePrice,
      categoryId,
      categoryName: category.categoryName,
      brandId,
      brandName: brand.brandName,
      genderId,
      genderName: gender.genderName,
      colorId,
      colorName: color.colorName,
      subCategoryId,
      subCategoryName: subCategory.subCategoryName,
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

    await product.destroy();
    return product;
  }

  async isExist(id) {
    const basket = await ProductMapping.findByPk(id);
    return basket;
  }
}

export default new Product();
