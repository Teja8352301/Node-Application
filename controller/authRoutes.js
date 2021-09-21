const express = require('express')
const router = express.Router()
const rootPath = require('../utils/rootPath')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const sessionStore = require('../utils/sessionStore');
const UserModal = require('../model/userModal');
const User = require('../model/userModal');
const nodemailer = require('../utils/nodeMailer');
const Otp = require('../model/otpBehaviour');

router.get('/login',(req,res,next)=>{
    res.render(path.join(rootPath,'views','login'),{logged:req.logged,errMsg:''})
})

router.get('/signup',(req,res,next)=>{
    // sessionStore.destroy(req.session.id,(err)=>{
        res.render(path.join(rootPath,'views','signup'),{logged:req.logged})
    // })
})

router.post('/postSignup',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const repassword = req.body.repassword;
    User.findAll({where:{email:email}}).then(user=>{
        if(!(user && user.length)){
            if(password === repassword){
                let oneTimePass = Math.floor(100000 + Math.random() * 900000);
                const dateInMs = new Date().getTime();
                let milliSeconds = dateInMs+600000
                        let uuid = uuidv4();
                        Otp.findOne({where:{email:email}}).then(async(otp)=>{
                            if(otp){
                                await otp.destroy()
                            }
                            Otp.create({id:uuid,email:email,password:password,otp:oneTimePass,expiry:milliSeconds}).then(()=>{
                                let name = email.split('@')[0];
                                let nodeEmail = {
                                    to:email,
                                    from: 'tejayerraguntla9@gmail.com',
                                    subject: 'Otp to create Account',
                                    text: 'Otp to create Account',
                                    html: `<p>Hi ${name},<br/>The Otp is ${oneTimePass}</p>`
                                };
                            
                            nodemailer.sendMail(nodeEmail, function(err, res) {
                                if (err) { 
                                    console.log(err) 
                                }
                                console.log(res);
                            });
                            res.render(path.join(rootPath,'views','otp-sign'),{logged:req.logged,email:email,id:uuid,invalidMsg:'',id:uuid})
                        })
                    })
                }
            }
        else{
            res.render(path.join(rootPath,'views','login'),{logged:req.logged,errMsg:'Email Already Found'})
        }
    })
})

router.get('/logout',(req,res,next)=>{
    const storeId = req.session.id
    sessionStore.destroy(storeId,(err)=>{
        res.redirect('/login')
    })
})

router.post('/postLogin',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    UserModal.findAll({where:{email:email,password:password}}).then(users=>{
        if(users && users.length){
            req.session.loggedIn = true
            req.session.userId = users[0].id
            res.redirect('/shop')
        }
        else{
            const loginError = 'Invalid Email or Password'
            res.render(path.join(rootPath,'views','login'),{logged:req.logged,errMsg:loginError})
        }
    })
})

router.post('/checkOTP',(req,res,next)=>{
    let otp = req.body.otp
    let id = req.body.id

    let milliSeconds = new Date().getTime();
    Otp.findByPk(id).then(result=>{
        if(result){
            if(otp === result.otp){
                if(milliSeconds > result.expiry){
                    res.render(path.join(rootPath,'views','otp-sign'),{logged:req.logged,email:result.email,id:id,invalidMsg:'Otp is Expired.Please SignUp again'})
                }
                else{
                    User.create({id:uuidv4(),email:result.email,password:result.password}).then(user=>{
                        user.createCart({id:uuidv4(),totalPrice:0}).then(()=>{
                            Otp.findByPk(id).then((otp)=>{
                                otp.destroy().then(()=>{
                                    req.session.loggedIn = true
                                    req.session.userId = user.id
                                    res.redirect('/shop')
                                })
                            })
                            
                        })
                    })
                }
            }
            else{
                res.render(path.join(rootPath,'views','otp-sign'),{logged:req.logged,email:result.email,id:id,invalidMsg:'Invalid OTP'})
            }
        }
        else{
            res.redirect('/signup')
        }
    })
})


module.exports = router