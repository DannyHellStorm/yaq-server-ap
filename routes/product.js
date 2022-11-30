import express from 'express';
import ProductController from '../controllers/Product.js';
import ProductPropController from '../controllers/ProductProp.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.post('/getall/category', ProductController.getAllProductsByCategory);
router.post(
  '/getall/subcategory',
  ProductController.getAllProductsBySubCategory
);
router.post('/getall/productname', ProductController.getAllProductsByName);
router.post('/getall/filter', ProductController.getAllProductsByFilter);

router.get('/search/:key', ProductController.searchProduct);
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
