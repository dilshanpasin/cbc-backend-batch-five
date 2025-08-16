import Product from "../models/product.js";
import webtoken from "jsonwebtoken";
import { isAdmin } from "./userController.js";

export async function getProducts(req, res){
    
    try{
        if(isAdmin(req)){
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({isAvailable : true})
            res.json(products)
        }
       
    }catch(err)
    {
        res.json({
            message : "Failed To Get Products",
            error : err
        })
    }
}
export function saveProduct(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not Authorized to add products"
        })
        return
    }
    
   //Products
    const product = new Product(
        req.body
    );

    product.save().then(()=>{
        res.json({
                message : "Product Added Successfully"
            })
    }).catch(()=>{
        req.json({
            message : "Failed To Add Product"
        })
    }

    )
}
export async function deleteProduct(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not Authorized to delete products"
        })
        return
    }
    try{
        await Product.deleteOne({productId : req.params.productId})

        res.json({
            message : "Product Deleted Successfully"
        })
    }catch(err){
        res.status(500).json({
            message : "Failed To Delete Product",
            error : err
        })
    }
}

export async function updateProduct(req, res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not Authorized to update products"
        })
        return
    }

    const productId = req.params.productId
    const updatingData = req.body

    try{
        await Product.updateOne(
            {productId : productId},
            updatingData
        )

        res.json({
            message : "Product Updated Successfully"
        })

    }catch(err){
        res.status(500).json({
            message : "Internal Server Error",
            error : err
        })
    }
}

export async function getProductById(req, res) {
    const productId = req.params.productId
    
    try{

        const product = await Product.findOne(
            {productId : productId}
        )

        if(!product == null){
            res.status(404).json({
                message : "Product Not Found"
            })
            return
        }
        if(product.isAvailable){
            res.json(product)
        }else{
            if(!isAdmin(req)){
               res.status(404).json({
                message : "Product Not Found"
            })
            return 
            }else{
                res.json(product)
            }
        }


    }catch{

    }

}