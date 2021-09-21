const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/dbConnect')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    }
},{timestamps: false})

module.exports = User