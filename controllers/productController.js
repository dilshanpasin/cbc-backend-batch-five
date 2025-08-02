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
