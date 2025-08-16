import express from 'express';
import { getProducts, saveProduct, deleteProduct, updateProduct, getProductById } from '../controllers/productController.js';

const productRouter = express.Router();


productRouter.get("/", getProducts);

productRouter.post("/", saveProduct);

productRouter.delete("/:productId", deleteProduct);

productRouter.put("/:productId", updateProduct)

productRouter.get("/:productId", getProductById)


export default productRouter;