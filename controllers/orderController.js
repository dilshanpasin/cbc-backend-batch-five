import Order from "../models/order.js"
import Product from "../models/product.js"

export async function createOrder(req, res) {
    //get User Information
    if(req.user == null){
        req.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const orderInfo = req.body

    if(orderInfo.name == null){
        orderInfo.name = req.user.firstName + " " + req.user.lastName
    }

    //CBC00001
    let orderId = "CBC00001"

    const lastOrder = await Order.find().sort({date :  -1}).limit(1)
    //[] It is outcome is array
    if(lastOrder.length > 0){
        const lastOrderId = lastOrder[0].orderId
        //CBC00551
        const lastOrderNumberString = lastOrderId.replace("CBC", "")
        //00551
        const lastOrderNumber = parseInt(lastOrderNumberString)
        //551
        const newOrderNumber = lastOrderNumber + 1
        //552
        const newOrderNumberString = String(newOrderNumber).padStart(5, "0");
        orderId = "CBC" +newOrderNumberString
        // "CBC00552"
    }

    try{
        let total =  0;
        let labeledTotal = 0;
        const products = []


        for(let i = 0; i < orderInfo.products.length; i++){

            const item = await Product.findOne({productId : orderInfo.products[i].productId})
            if(item == null){
                res.status(404).json({
                    message : "Product with Product Id " + orderInfo.products[i].productId + " not found"
                })
                return
            }
            if(item.isAvailable == false){
                res.status(404).json({
                    message : "Product with Product Id " + orderInfo.products[i].productId + " is not available right now"
                })
                return
            }
            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.name,
                    altNames : item.altNames,
                    description : item.description,
                    images : item.images,
                    labledPrice : item.labledPrice,
                    price : item.price
                },
                quantity : orderInfo.products[i].qty
            }
           // total = total + (item.price * orderInfo.products[i].quantity)
            total += (item.price * orderInfo.products[i].qty)
            //labeledTotal = labeledTotal + (item.labledPrice * orderInfo.products[i].quantity)
            labeledTotal += (item.labledPrice * orderInfo.products[i].qty)

        }

    const order = new Order({
        orderId : orderId,
        email : req.user.email,
        name : orderInfo.name,
        address : orderInfo.address,
        total : 0,
        phone : orderInfo.phone,
        products : products,
        labeledTotal : labeledTotal,
        total : total
    })
    try{
        const createdOrder = await order.save()
        res.json({
            message : "Order created successfully",
            order : createdOrder

        })
    }catch(err){
        res.status(500).json({
            message : "Failed to create order",
            error : err
        })
    }

    }catch(err){

    }
    
    //add current user name if not provided
    //order Id generate
    //create order object
}