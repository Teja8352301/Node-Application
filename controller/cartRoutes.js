const express = require('express')
const router = express.Router()
const rootPath = require('../utils/rootPath')
const path = require('path')
const ProductModal = require('../model/productModal')
const UserModel = require('../model/userModal')
const { v4: uuidv4 } = require('uuid');

const authorization = require('./authorization')

router.get('/cart',authorization,(req,res,next)=>{
    req.user.getCart({ include:
        [{ model: ProductModal }] }).then(cart=>{
            cart.Products = cart.Products.map(el => el.get({ plain: true }))
            res.render(path.join(rootPath,'views','cart'),{cart:cart,logged:req.logged})
    })
})

router.post('/addItemToCart',authorization,(req,res,next)=>{
    let prodId = req.body.productId;
    req.user.getProducts({where:{id:prodId}}).then(products=>{
        let product = products[0];
        let quantity = 1
        req.user.getCart().then(cart=>{
           cart.getProducts({where:{id:prodId}}).then(products=>{
               if(products.length){
                   let oldProduct = products[0];
                   quantity = parseInt(oldProduct.CartItem.quantity)+1;
               }
               cart.addProduct(product,{through:{title:product.title,price:parseInt(product.price)*parseInt(quantity),quantity:quantity,id:uuidv4()}}).then(product=>{
                   cart.getProducts().then(products=>{
                       let totalPrice = products.reduce((curr,next)=>{
                           return curr+parseInt(next.CartItem.price)
                       },0)
                       cart.totalPrice = totalPrice;
                       cart.save().then(()=>{
                           res.redirect('/cart')
                       })
                   })
               })
           })
        })
    })
})

router.post('/removeCartItem',authorization,(req,res,next)=>{
    const prodId = req.body.productId;
    req.user.getCart().then(cart=>{
        cart.getProducts({where:{id:prodId}}).then(products=>{
            let product = products[0];
            // product.CartItem.destroy().then(()=>{
                if(product.CartItem.quantity>1){
                    product.CartItem.quantity = product.CartItem.quantity-1
                    product.CartItem.price = parseInt(product.price) * parseInt(product.CartItem.quantity)
                    product.CartItem.save().then(()=>{
                        req.user.getCart().then(cart=>{
                            cart.getProducts().then(products=>{
                                let totalPrice = products.reduce((curr,next)=>{
                                    return curr+parseInt(next.CartItem.price)
                                },0)
                                cart.totalPrice = totalPrice;
                                cart.save().then(()=>{
                                    res.redirect('/cart')
                                })
                            })
                        })
                        // res.redirect('/cart')
                    })
                }else{
                    product.CartItem.destroy().then(()=>{
                        req.user.getCart().then(cart=>{
                            cart.getProducts().then(products=>{
                                let totalPrice = products.reduce((curr,next)=>{
                                    return curr+parseInt(next.CartItem.price)
                                },0)
                                cart.totalPrice = totalPrice;
                                cart.save().then(()=>{
                                    res.redirect('/cart')
                                })
                            })
                        })
                    })
                }
            // })
        })
    })
})

module.exports = router