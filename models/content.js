module.exports = function(sequelize, DataType){
    return sequelize.define('content', {
        creator:{
            type: DataType.STRING,
            allowNull: false,
        },
        label:{
            type: DataType.STRING,
            allowNull: false,
        },
        content_text:{
            type: DataType.TEXT,
            allowNull: false,
        }
    });
};