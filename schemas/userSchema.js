module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        place: {
            type: DataTypes.STRING,
            default: 0
        },
        chat_id: {
            type: DataTypes.STRING,
            unique: true
        },
        suspect_id: {
            type: DataTypes.STRING,
        },
        firstname: {
            default: 0,
            type: DataTypes.STRING
        },
        years: {
            default: 0,
            type: DataTypes.STRING
        },
        gender:{
            default: 0,
            type: DataTypes.INTEGER,
        },
        about: {
            default: 0,
            type: DataTypes.STRING
        },
        who: {
            default: 0,
            type: DataTypes.INTEGER,
        },
        file_id: {
            default: 0,
            type: DataTypes.STRING,
        },
        region: {
            default: 'none',
            type: DataTypes.STRING,
        },
        city: {
            default: 'none',
            type: DataTypes.STRING,
        },
        register_status: {
            type: DataTypes.INTEGER,
            default: 0
        },
        register_now:{
            type: DataTypes.INTEGER,
            default: 0,
        },
        language: {
            type: DataTypes.INTEGER,
            default: 0
        }
    })

    return User

}
