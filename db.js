const Sequelize = require('sequelize');

const sequelize = new Sequelize('cosmos', 'postgres', 'skysphere11',
   
    {
    host: 'localhost',
    dialect: 'postgres'
})

sequelize.authenticate().then(
    function(){
        console.log('Connected to Cosmos')
    },
    function(err){
        console.log(err);
    }
);

module.exports = sequelize;