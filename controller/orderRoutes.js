const express = require('express')
const router = express.Router()
const rootPath = require('../utils/rootPath')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const authorization = require('./authorization')
const fileSystem = require('fs')
let pdf = require("html-pdf")
const ejs = require('ejs')
const OrderItemModal = require('../model/orderItemModal')

router.get('/orders',authorization,(req,res,next)=>{
    req.user.getOrders().then((orders)=>{
        res.render(path.join(rootPath,'views','order'),{orders:orders,logged:req.logged})
    })
})

router.post('/addOrder',authorization,(req,res,next)=>{
    let cartId = req.body.cartId;
    req.user.getCart().then(cart=>{
        cart.getProducts().then(products=>{
            req.user.createOrder({id:uuidv4(),totalPrice:cart.totalPrice}).then(order=>{
                products.map(async(product)=>{
                    await order.addProduct(product,{through:{id:uuidv4(),title:product.CartItem.title,quantity:product.CartItem.quantity,price:product.CartItem.price}})
                    await product.CartItem.destroy()
                    return ''
                })
                const updatedOrder = [order].map(el => el.get({ plain: true }))
                res.redirect('/orders')
            })
        })
    })

})

router.post('/invoice/:orderId',authorization,(req,res,next)=>{
    let orderId = req.params.orderId
    req.user.getOrders({where:{id:orderId}}).then(orders=>{
        let order = orders[0]
        order.getProducts({through:'OrderItemModal'}).then(rawData=>{
            let products = rawData.map(el => el.get({ plain: true }))
            
            ejs.renderFile(path.join(rootPath,'utils','orderDynamic.ejs'), {products:products,email:req.user.email}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile(path.join(rootPath,'utils',`${orderId}.pdf`), function (err, data) {
                if (err) {
                    res.redirect('/orders')
                } else {
                    fileSystem.readFile(path.join(rootPath,'utils',`${orderId}.pdf`),(err,pdfData)=>{
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=${orderId}.pdf`)
                    res.send(pdfData);
                    })
                }
            });
        }
    })
        })
    })
})

module.exports = router