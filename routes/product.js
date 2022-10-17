import express from 'express';
import ProductController from '../controllers/Product.js';
import ProductPropController from '../controllers/ProductProp.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

// список товаров выбранной категории и выбранного бренда
router.get(
  '/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)/colorId/:colorId([0-9]+)/sizeId/:sizeId([0-9]+)',
  ProductController.getAll
);

router.get('/getall/colorId/:colorId([0-9]+)', ProductController.getAll);
router.get('/getall/sizeId/:sizeId([0-9]+)', ProductController.getAll);
router.get('/getall/categoryId/:categoryId([0-9]+)', ProductController.getAll);
router.get('/getall/brandId/:brandId([0-9]+)', ProductController.getAll);

router.get('/search/:key', ProductController.searchProduct);

router.get('/getall', ProductController.getAll);
router.get('/getone/:id([0-9]+)', ProductController.getOne);
router.post(
  '/create',
  // authMiddleware,
  // adminMiddleware,
  ProductController.create
);
router.put(
  '/update/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  ProductController.update
);
router.delete(
  '/delete/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  ProductController.delete
);

// cвойства продукта
router.get(
  '/product/:productId([0-9]+)/property/getall',
  ProductPropController.getAll
);
router.get(
  '/product/:productId([0-9]+)/property/getone/:id([0-9]+)',
  ProductPropController.getOne
);
router.post(
  '/product/:productId([0-9]+)/property/create',
  // authMiddleware,
  // adminMiddleware,
  ProductPropController.create
);
router.put(
  '/product/:productId([0-9]+)/property/update/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  ProductPropController.update
);
router.delete(
  '/product/:productId([0-9]+)/property/delete/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  ProductPropController.delete
);

export default router;
