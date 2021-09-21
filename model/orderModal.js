const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/dbConnect')

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    totalPrice:{
        type:DataTypes.STRING
    }
    
},{timestamps: false});

module.exports = Order