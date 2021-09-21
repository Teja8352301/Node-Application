const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/dbConnect')

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    totalPrice:{
        type:DataTypes.STRING
    }
},{timestamps: false});

module.exports = Cart