const express = require('express')
const router = express.Router()
const rootPath = require('../utils/rootPath')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const ProductModal = require('../model/productModal')
const UserModel = require('../model/userModal')

const authorization = require('./authorization')

router.get('/add-product',authorization,(req,res,next)=>{
    res.render(path.join(rootPath,'views','add-product'),{type:'',logged:req.logged})
})

router.post('/postAddProduct',authorization,(req,res,next)=>{
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const productId = req.body.productId
    if(productId){
        req.user.getProducts({where:{id:productId}}).then(products=>{
            let product = products[0];
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price
            product.description = description
            id=productId
            product.save().then(()=>{
                res.redirect('/shop')
            })
        })
    }
    else{
        const product = req.user.createProduct({id:uuidv4(),title:title,imageUrl:imageUrl,price:price,description:description}).then(()=>{
            res.redirect('/shop')
        })    
    }
})

router.get('/products',authorization,(req,res,next)=>{
    req.user.getProducts().then((rawData)=>{
        let data = rawData.map(el => el.get({ plain: true }))
        res.render(path.join(rootPath,'views','admin-products'),{data:data,logged:req.logged})
    })
})

router.post('/deleteProduct/:productId',authorization,(req,res,next)=>{
    const productId = req.params.productId;
    ProductModal.findByPk(productId).then((product)=>{
        product.destroy().then(()=>{
            res.redirect('/admin/products')
    })
    })
})


router.post('/editProduct/:productId',authorization,(req,res,next)=>{
    const productId = req.params.productId;
    ProductModal.findByPk(productId).then((product)=>{
        let data = [product].map(el => el.get({ plain: true }))
        res.render(path.join(rootPath,'views','add-product'),{data:data,type:'edit',logged:req.logged})

    })
})


module.exports = router