import express from 'express';

import product from './product.js';
import category from './category.js';
import brand from './brand.js';
import user from './user.js';
import basket from './basket.js';
import wishlist from './Wishlist.js';
import order from './order.js';
import size from './size.js';
import color from './color.js';
import variation from './variation.js';
import gender from './gender.js';
import payment from './payment.js';

const router = new express.Router();

router.use('/product', product);
router.use('/category', category);
router.use('/brand', brand);
router.use('/user', user);
router.use('/basket', basket);
router.use('/wishlist', wishlist);
router.use('/order', order);
router.use('/size', size);
router.use('/color', color);
router.use('/variation', variation);
router.use('/gender', gender);
router.use('/payment', payment);

export default router;
