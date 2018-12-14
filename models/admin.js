module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define('admin', {

        adminID: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: {
             type: DataTypes.STRING,
             allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    });
    return Admin;
}