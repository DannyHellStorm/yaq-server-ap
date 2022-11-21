import express from 'express';
import CategoryController from '../controllers/Category.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.get(
  '/getall/category/subcategory',
  CategoryController.getAllCatAndSubCat
);
router.get('/getone/category/:id([0-9]+)', CategoryController.getOneCategory);

router.post(
  '/create/category',
  authMiddleware,
  adminMiddleware,
  CategoryController.createCategory
);
router.put(
  '/update/category/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  CategoryController.updateCategory
);
router.delete(
  '/delete/category/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  CategoryController.deleteCategory
);

// Subcategory properties
router.post(
  '/create/subcategory',
  authMiddleware,
  adminMiddleware,
  CategoryController.createSubCategory
);
router.put(
  '/update/subcategory/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  CategoryController.updateSubCategory
);
router.delete(
  '/delete/subcategory/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  CategoryController.deleteSubCategory
);

export default router;
