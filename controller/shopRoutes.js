const express = require('express')
const router = express.Router()
const rootPath = require('../utils/rootPath')
const path = require('path')
const ProductModal = require('../model/productModal')
const authorization = require('./authorization')


router.get('/products',authorization,(req,res,next)=>{
    req.user.getProducts().then((rawData)=>{
        let data = rawData.map(el => el.get({ plain: true }))
        res.render(path.join(rootPath,'views','products'),{data:data,logged:req.logged})
    })
})

router.post('/showDetail/:productId',authorization,(req,res,next)=>{
    const productId = req.params.productId;
    ProductModal.findByPk(productId,{raw: true}).then((data)=>{
        res.render(path.join(rootPath,'views','details'),{...data,logged:req.logged})
    })
})
router.get('/shop',authorization,(req,res,next)=>{
    req.user.getProducts().then((rawData)=>{
        let data = rawData.map(el => el.get({ plain: true }))
        res.render(path.join(rootPath,'views','products'),{data:data,logged:req.logged})
    })
})


module.exports = router