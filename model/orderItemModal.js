const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/dbConnect')

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title:{
        type:DataTypes.STRING
    },
    quantity:{
        type:DataTypes.STRING
    },
    price:{
        type:DataTypes.STRING
    }
},{timestamps: false});

module.exports = OrderItem