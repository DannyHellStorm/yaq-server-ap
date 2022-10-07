import { Wishlist as WishlistMapping } from './mapping.js';
import { Product as ProductMapping } from './mapping.js';
import { WishlistProduct as WishlistProductMapping } from './mapping.js';

const wishlistDTO = (wishlist) => {
  const data = {};
  data.id = wishlist.id;
  data.products = [];
  if (wishlist.products) {
    data.products = wishlist.products.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
      };
    });
  }
  return data;
};

class Wishlist {
  async getOne(wishlistId) {
    let wish = await WishlistMapping.findByPk(wishlistId, {
      attributes: ['id'],
      include: [{ model: ProductMapping, attributes: ['id', 'name', 'price'] }],
    });

    console.log('HELLLOOOOOO', wish);

    if (!wish) {
      wish = await WishlistMapping.create();
    }
    return wishlistDTO(wish);
  }

  async create() {
    const wish = await WishlistMapping.create();
    return wishlistDTO(wish);
  }

  async append(wishlistId, productId) {
    let wish = await WishlistMapping.findByPk(wishlistId, {
      attributes: ['id'],
      include: [{ model: ProductMapping, attributes: ['id', 'name', 'price'] }],
    });

    if (!wish) {
      wish = await WishlistMapping.create();
    }

    // проверяем, есть ли уже этот товар в корзине
    const wishlist_product = await WishlistProductMapping.findOne({
      where: { wishlistId, productId },
    });
    if (!wishlist_product) {
      // есть в корзине
      await WishlistProductMapping.create({ wishlistId, productId });
    }
    // обновим объект корзины, чтобы вернуть свежие данные
    await wish.reload();
    return wishlistDTO(wish);
  }

  async remove(wishlistId, productId) {
    let wish = await WishlistMapping.findByPk(wishlistId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });

    if (!wish) {
      wish = await WishlistMapping.create();
    }

    const wishlist_product = await WishlistProductMapping.findOne({
      where: { wishlistId, productId },
    });
    if (wishlist_product) {
      await wishlist_product.destroy();
      await wish.reload();
    }
    return wishlistDTO(wish);
  }

  async clear(wishlistId) {
    let wish = await WishlistMapping.findByPk(wishlistId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });

    if (wish) {
      await WishlistProductMapping.destroy({ where: { wishlistId } });
    } else {
      wish = await WishlistMapping.create();
    }

    return wishlistDTO(wish);
  }

  async delete(wishlistId) {
    const wishlist = await WishlistMapping.findByPk(wishlistId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });
    if (!wishlist) {
      throw new Error('Корзина не найдена в БД');
    }
    await wishlist.destroy();
    return wishlistDTO(wishlist);
  }
}

export default new Wishlist();
