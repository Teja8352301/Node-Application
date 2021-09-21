const express = require('express')
const app = express()
const rootPath = require('./utils/rootPath')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser')
const session = require('express-session')
// var MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const shopRoute = require('./controller/shopRoutes')
const adminRoute = require('./controller/adminRoutes')
const cartRoute = require('./controller/cartRoutes')
const orderRoute = require('./controller/orderRoutes')
const authRoutes = require('./controller/authRoutes')
const dbConnect  = require('./utils/dbConnect')
const ProductModel = require('./model/productModal')
const UserModel = require('./model/userModal')
const CartModel = require('./model/cartModal')
const CartItemModel = require('./model/cartItemModal')
const OrderItemModel = require('./model/orderItemModal')
const OrderModel = require('./model/orderModal')
const sessionStore = require('./utils/sessionStore');
const Otp = require('./model/otpBehaviour');


app.set('view engine', 'ejs');

UserModel.hasMany(ProductModel,{ constraints: true, onDelete: 'CASCADE' });
ProductModel.belongsTo(UserModel)
UserModel.hasOne(CartModel)
CartModel.belongsTo(UserModel)
CartModel.belongsToMany(ProductModel,{through:CartItemModel})
// ProductModel.belongsToMany(CartModel,{through:CartItemModel})
UserModel.hasMany(OrderModel)
OrderModel.belongsTo(UserModel)
OrderModel.belongsToMany(ProductModel,{through:OrderItemModel})

app.use(cookieParser())
app.use(bodyParser());

var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '12345678',
	database: 'shop'
};

app.use(session({
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

app.use(shopRoute)

app.use(cartRoute)

app.use(orderRoute)

app.use(authRoutes)

app.use('/admin',adminRoute)

app.use('/',(req,res,next)=>{
    res.redirect('/shop')
})


dbConnect.sync().then(()=>{
    app.listen(3000,()=>{
        console.log("NODE SERVER CONNECTED TO PORT 3000")
    })
})
