const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/dbConnect')

const Otp = sequelize.define('Otp', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    otp:{
        type:DataTypes.STRING
    },
    expiry:{
        type:DataTypes.STRING
    }
},{timestamps: false});

module.exports = Otp

