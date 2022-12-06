import {
  Basket as BasketMapping,
  BasketProduct as BasketProductMapping,
  Product as ProductMapping,
} from './mapping.js';

class Basket {
  async getOne(basketId) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }
    return basket;
  }

  async create() {
    const basket = await BasketMapping.create();
    return basket;
  }

  async append(basketId, productId, quantity, productSize) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId, productSize },
    });

    const product = await ProductMapping.findOne({
      where: {
        id: productId,
      },
    });

    if (basket_product) {
      // есть в корзине
      await basket_product.increment('quantity', { by: quantity });
      await basket_product.reload();
      await basket_product.update({
        totalPrice: parseInt(product.price * basket_product.quantity),
      });
      await basket_product.reload();
    } else {
      // нет в корзине
      await BasketProductMapping.create({
        basketId,
        productId,
        productName: product.productName,
        productColor: product.colorName,
        productSize,
        productPrice: product.price,
        totalPrice: parseInt(product.price * quantity),
        quantity,
      });
    }

    let items = await BasketProductMapping.findAll({
      where: {
        basketId,
      },
    });

    const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    await basket.update({
      amount,
    });

    await basket.reload();
    return basket;
  }

  async increment(basketId, productId, productSize, quantity) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId, productSize },
    });

    const product = await ProductMapping.findOne({
      where: {
        id: productId,
      },
    });

    if (basket_product) {
      await basket_product.increment('quantity', { by: quantity });
      await basket_product.reload();
      await basket_product.update({
        totalPrice: parseInt(product.price * basket_product.quantity),
      });
      await basket_product.reload();
    }

    let items = await BasketProductMapping.findAll({
      where: {
        basketId,
      },
    });

    const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    await basket.update({
      amount,
    });

    await basket.reload();
    return basket;
  }

  async decrement(basketId, productId, productSize, quantity) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId, productSize },
    });

    const product = await ProductMapping.findOne({
      where: {
        id: productId,
      },
    });

    if (basket_product) {
      if (basket_product.quantity > quantity) {
        await basket_product.decrement('quantity', { by: quantity });
        await basket_product.reload();
        await basket_product.update({
          totalPrice: parseInt(product.price * basket_product.quantity),
        });
        await basket_product.reload();
      } else {
        await basket_product.destroy();
      }

      await basket.reload();
    }

    let items = await BasketProductMapping.findAll({
      where: {
        basketId,
      },
    });

    const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    await basket.update({
      amount,
    });

    await basket.reload();
    return basket;
  }

  async remove(basketId, productId, productSize) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId, productSize },
    });

    if (basket_product) {
      await basket_product.destroy();
      await basket.reload();
    }

    let items = await BasketProductMapping.findAll({
      where: {
        basketId,
      },
    });

    const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    await basket.update({
      amount,
    });

    await basket.reload();
    return basket;
  }

  async clear(basketId) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (basket) {
      await BasketProductMapping.destroy({ where: { basketId } });
    } else {
      basket = await Basket.create();
    }

    return basket;
  }

  async delete(basketId) {
    let basket = await BasketMapping.findOne({
      where: {
        id: basketId,
      },
      attributes: ['id', 'amount'],
      include: [
        {
          model: BasketProductMapping,
          as: 'basket_products',
          attributes: [
            'id',
            'productId',
            'productName',
            'productColor',
            'productSize',
            'productPrice',
            'totalPrice',
            'quantity',
          ],
        },
      ],
    });

    if (!basket) {
      throw new Error('Корзина не найдена в БД');
    }

    await basket.destroy();
    return basket;
  }
}

export default new Basket();
