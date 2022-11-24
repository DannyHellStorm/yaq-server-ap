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
              attributes: ['id', 'optionName', 'count'],
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

  async createOption(productVariationId, productId, data, img) {
    const optionName = FileService.save(img) ?? '';
    const { count = null } = data;

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
      count,
      productVariationId,
    });

    return result;
  }
}

export default new Variation();
