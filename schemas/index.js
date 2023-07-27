const dbConfig = require('../config/database');

const {Sequelize, DataTypes, QueryTypes, Op} = require('sequelize');
const colog = require("colog");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        logging: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    colog.success('DB / Status: Connection')
})
.catch(err => {
    console.error('DB / Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


//  Importing shemas
db.user = require('./userSchema.js')(sequelize, DataTypes) // userModel

db.sequelize.sync({ force: false })
.then(() => {
    colog.success('DB / Models SYNC')
})



// 1 to Many Relation






module.exports = db
