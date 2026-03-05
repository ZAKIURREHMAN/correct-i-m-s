
import express from "express"
import {createProduct, getProductsByCompany, getAllProducts, updateProducts} from "./ProductController.js"
const router = express.Router()

router.post('/create/:supplierId',createProduct)
router.get('/by-company/:companyId', getProductsByCompany)
// Optional: expose all products
router.get('/', getAllProducts)

// New: update product by id (support both plain and /update path)
router.put('/:productId', updateProducts)
router.put('/update/:productId', updateProducts)

export default router