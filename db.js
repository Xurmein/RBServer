const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE_URL ||
    `postgresql:postgres:${encodeURIComponent(process.env.PASS)}@localhost/cosmoknotserver`,
    {
    dialect: 'postgres',
})

sequelize.authenticate().then(
    function(){
        console.log('cosmoknotserver + pgDB = 4eva! lol')
    },
    function(err){
        console.log(err);
    }
);

module.exports = sequelize;