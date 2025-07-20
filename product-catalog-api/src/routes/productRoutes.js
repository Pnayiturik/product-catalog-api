const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');

router.post(
  '/',
  [
    body('name').isString().trim().notEmpty(),
    body('category').isMongoId(),
    body('price').isFloat({ min: 0 }),
    body('discount').optional().isFloat({ min: 0, max: 100 }),
    body('variants').optional().isArray(),
    body('stock').optional().isInt({ min: 0 }) // Add stock validation
  ],
  productController.createProduct
);

router.get(
  '/',
  [
    query('name').optional().isString(),
    query('category').optional().custom((value) => {
      if (typeof value === 'string' && value.length > 0) {
        return true;
      }
      throw new Error('Category must be a valid ObjectId or category name');
    }),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('minStock').optional().isInt({ min: 0 }),
    query('maxStock').optional().isInt({ min: 0 }),
    query('inStock').optional().isBoolean(),
    query('minDiscount').optional().isFloat({ min: 0, max: 100 }),
    query('maxDiscount').optional().isFloat({ min: 0, max: 100 }),
    query('hasDiscount').optional().isBoolean(),
    query('createdAfter').optional().isISO8601(),
    query('createdBefore').optional().isISO8601(),
    query('sortBy').optional().isIn(['name', 'price', 'totalStock', 'discount', 'createdAt']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ],
  productController.getProducts
);

// Move this above '/:id'
router.get('/report/low-stock', productController.getLowStockProducts);

router.get('/:id', param('id').isMongoId(), productController.getProductById);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('name').optional().isString().trim(),
    body('category').optional().isMongoId(),
    body('price').optional().isFloat({ min: 0 }),
    body('discount').optional().isFloat({ min: 0, max: 100 }),
    body('variants').optional().isArray(),
    body('stock').optional().isInt({ min: 0 }) 
  ],
  productController.updateProduct
);

router.delete('/:id', param('id').isMongoId(), productController.deleteProduct);

module.exports = router;