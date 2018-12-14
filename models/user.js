module.exports = function(sequelize, DataType){
    return sequelize.define('user', {
        username:{
            type: DataType.STRING,
            allowNull: false,
            unique: true      
        },
        password:{
            type: DataType.STRING,
            allowNull: false
        },
        is_admin:{
            type: DataType.BOOLEAN,
            allowNull: true
        },
        adminID:{
            type: DataType.STRING,
            allowNull: false,
            unique: false,
            validate:{
                isEmail : true
            }
        }
    });
};