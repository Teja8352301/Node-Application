const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/dbConnect')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title:{
        type:DataTypes.STRING
    },
    imageUrl:{
        type:DataTypes.STRING
    },
    price:{
        type:DataTypes.STRING
    },
    description:{
        type:DataTypes.STRING
    }
},{timestamps: false});

module.exports = Product

