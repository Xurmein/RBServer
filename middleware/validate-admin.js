var jwt = require('jsonwebtoken');
var sequelize = require('../db');
var User = sequelize.import('../models/user');


module.exports = function(req, res, next){
    if(req.method == 'OPTIONS'){
        next();
    } else {
        let adminToken = req.headers.authorization;
        if (!adminToken) return res.status(403).send({ authorized: false, message: 'No admin token provided.' });
            jwt.verify(adminToken, process.env.SIGN, (err, decoded) => {
                if(decoded){
                    User.findOne(
                        { where: { id : decoded.id} }
                        ).then(user => { 
                            req.user = user;
                            next();
                        },
                        function(){ res.status(401).send({error: 'Not authorized, admin status required'})
                    }); 
                } else { res.status(401).send({error: 'Not authorized, admin status required'}) 
            }
        });
    }
}