const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/product.controller')
const singleUpload = require('../middlewares/multer')

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById)
productRouter.get('/category/:category', productController.getProductsByCategory)



// for admin
productRouter.post('/',[singleUpload], productController.createProduct)
productRouter.put('/:id', productController.updateProduct)
productRouter.delete('/:id', productController.deleteProduct)

module.exports = productRouter;