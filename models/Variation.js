import {
  ProductVariations as ProductVariationsMapping,
  ProductVarOptions as ProductVarOptionsMapping,
  Product as ProductMapping,
} from './mapping.js';
import FileService from '../services/File.js';

class Variation {
  async getAllVariation(productId) {
    const result = await ProductMapping.findAll({
      where: {
        id: productId,
      },
      include: [
        {
          model: ProductVariationsMapping,
          attributes: ['id', 'variationName'],
          include: [
            {
              model: ProductVarOptionsMapping,
              attributes: ['id', 'optionName', 'optionImage', 'count'],
            },
          ],
        },
      ],
    });

    return result;
  }

  async createVariation(productId, data) {
    const { variationName } = data;
    const existProduct = await ProductMapping.findOne({
      where: {
        id: productId,
      },
    });

    if (!existProduct) {
      throw new Error('Продукт не найден в БД');
    }

    const variation = await ProductVariationsMapping.create({
      variationName,
      productId,
    });
    return variation;
  }

  async updateVariation(id, data) {
    const existVariation = await ProductVariationsMapping.findByPk(id);

    if (!existVariation) {
      throw new Error('Не найден вариант продукта в БД');
    }

    const {
      variationName = existVariation.variationName,
      productId = existVariation.productId,
    } = data;

    await existVariation.update({ variationName, productId });
    return existVariation;
  }

  async deleteVariation(id) {
    const variation = await ProductVariationsMapping.findByPk(id);

    if (!variation) {
      throw new Error('Не найден вариант продукта в БД');
    }

    await variation.destroy();
    return variation;
  }

  async createOption(productVariationId, productId, data, img) {
    const { optionName = null, count = null } = data;
    const optionImage = FileService.save(img) ?? '';

    const exist = await ProductVariationsMapping.findOne({
      where: {
        id: productVariationId,
        productId,
      },
    });

    if (!exist) {
      throw new Error('Продукт не найден в БД');
    }

    const result = await ProductVarOptionsMapping.create({
      optionName,
      optionImage,
      count,
      productVariationId,
    });

    return result;
  }

  async updateOption(id, data, img) {
    const existOption = await ProductVarOptionsMapping.findByPk(id);

    if (!existOption) {
      throw new Error('Не найден опция продукта в БД');
    }

    const file = FileService.save(img);

    if (file && existOption.optionImage) {
      FileService.delete(existOption.optionName);
    }

    const {
      optionImage = file ? file : existOption.optionImage,
      productVariationId = existOption.productVariationId,
    } = data;

    await existOption.update({
      optionImage,
      productVariationId,
    });

    await existOption.reload();
    return existOption;
  }

  async deleteOption(id) {
    const option = await ProductVarOptionsMapping.findByPk(id);

    if (!option) {
      throw new Error('Не найден опция продукта в БД');
    }

    if (option.optionImage) {
      FileService.delete(option.optionImage);
    }

    await option.destroy();
    return option;
  }
}

export default new Variation();
