import WishlistModel from '../models/Wishlist.js';
import AppError from '../errors/AppError.js';

const maxAge = 60 * 60 * 1000 * 24 * 365;
const signed = true;

class Wishlist {
  async getOne(req, res, next) {
    try {
      let wish;
      if (req.signedCookies.wishlistId) {
        wish = await WishlistModel.getOne(
          parseInt(req.signedCookies.wishlistId)
        );
      } else {
        wish = await WishlistModel.create();
      }
      res.cookie('wishlistId', wish.id, { maxAge, signed });
      res.json(wish);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async append(req, res, next) {
    try {
      const { productId } = req.params;
      let wishlistId;

      if (!req.signedCookies.wishlistId) {
        let created = await WishlistModel.create();
        wishlistId = created.id;
      } else {
        wishlistId = parseInt(req.signedCookies.wishlistId);
      }

      console.log('loool', req.signedCookies.wishlistId);

      const wish = await WishlistModel.append(wishlistId, productId);
      res.cookie('wishlistId', wish.id, { maxAge, signed });
      res.json(wish);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async remove(req, res, next) {
    try {
      let wishlistId;
      if (!req.signedCookies.wishlistId) {
        let created = await WishlistModel.create();
        wishlistId = created.id;
      } else {
        wishlistId = parseInt(req.signedCookies.wishlistId);
      }
      const wish = await WishlistModel.remove(wishlistId, req.params.productId);
      res.cookie('wishlistId', wish.id, { maxAge, signed });
      res.json(wish);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async clear(req, res, next) {
    try {
      let wishlistId;
      if (!req.signedCookies.wishlistId) {
        let created = await WishlistModel.create();
        wishlistId = created.id;
      } else {
        wishlistId = parseInt(req.signedCookies.wishlistId);
      }
      const wish = await WishlistModel.clear(wishlistId);
      res.cookie('wishlistId', wish.id, { maxAge, signed });
      res.json(wish);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Wishlist();
