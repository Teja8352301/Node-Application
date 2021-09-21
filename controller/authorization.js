const express = require('express')
const router = express.Router()
const rootPath = require('../utils/rootPath')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const sessionStore = require('../utils/sessionStore');
const UserModal = require('../model/userModal');

const authorization = (req,res,next)=>{
    const logged = req.session.loggedIn
    const userId = req.session.userId
    if(logged && userId){
        UserModal.findByPk(userId).then(user=>{
            if(user){
                req.logged = logged
                req.user = user
                next()
            }
            else{
                res.redirect('/signup')
            }
        })
    }
    else{
        res.redirect('/login')
        // res.render(path.join(rootPath,'views','login'),{logged:req.logged})
    }
}
module.exports = authorization