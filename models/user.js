module.exports = function(sequelize, DataTypes){

    
    return sequelize.define('user', {
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_admin:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        Qualities: {
            type: DataTypes.ENUM,
            values:
            ["",
            "Intelligence", "Adaptability",
            "Physical Condition", "Mental Endurance",
            "Education"
            ]
        }
        /*adminID:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }*/
    });
};