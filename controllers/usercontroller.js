var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var User = sequelize.import('../models/user');
var adminValidation = require('../middleware/validate-admin');
var sessionValidation = require('../middleware/validate-session');

router.post('/register/admin', function(req, res){ 
    let Username = req.body.user.username;
    let passwordhash = req.body.user.password;
    let admin = req.body.user.is_admin;
    let adminEmail = req.body.user.adminID;

    User.create({
        username : Username,
        password : bcrypt.hashSync(passwordhash, 15),
        is_admin : admin,
        adminID : adminEmail
    }).then(
        function createAdminSuccess(user){
            let aToken = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24});
            let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24});
            res.json({
                username : user,
                message : 'Successfully registered as administrator!',
                sessionToken : token,
                adminToken : aToken
            });
        }, 
    function createAdminFail(){
        res.status(500).send({error: '500 - Internal Server Error'})
    });
});
    
router.post('/register/new_user', adminValidation, function(req, res){
    let Username = req.body.user.username;
    let passwordhash = req.body.user.password
    let admin = req.body.user.is_admin;
    let AssociatedAdmin = req.body.user.adminID;

    User.create({
        username : Username,
        password : bcrypt.hashSync(passwordhash, 5),
        is_admin : admin,
        adminID : AssociatedAdmin
    }).then(
        function createUserSuccess(user){
            res.json({
                username : user,
                message : 'Successfully created a new user account',
            });
        },
    function createUserFail(){
        res.status(500).send({error: '500 - Internal Service Error'})
    });
}); 

router.post('/login', function(req, res){
    let admin = req.body.user.is_admin;

    if(admin === true){
        User.findOne({ where: { username : req.body.user.username }
        }).then(
            function adminLoginSuccess(user){
                if(user){
                    bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
                        if(authMatch){
                        let aToken = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                        let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                        res.json({
                            username : user,
                            message : `Welcome back, ${user.username}`,
                            sessionToken : token,
                            adminToken : aToken
                        });
                } else {
                    res.status(502).send({ error: "502/Bad Gateway"})
                }
            });
        } else {
            res.status(500).send({ error: "Have you registered yet?"})
        }   
    },
    function(){
        res.status(501).send({ error: "Here be dragons--turn back! Also, get in touch with the idiot that made this site..." })
    });
    } else if(admin === false || null){
        User.findOne({ where: { username : req.body.user.username }
        }).then(
            function userLoginSuccess(user){
                if(user){
                    bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
                        if(authMatch){
                            let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                            res.json({
                                username : user,
                                message : `Welcome back, ${user.username}`,
                                sessionToken : token
                            });
                        } else {
                            res.status(502).send({ error: "502/Bad Gateway"})
                        }
                    });
                } else {
                    res.status(500).send({ error: "Have you registered yet?"})
                }
            },
            function userLoginFail(){
                res.status(500).send({ error : '500 - Internal Server Error'})
            });
        }
    }
)

router.get('/sub-users', adminValidation, function(req, res){
    let AssociatedAdmin = req.user.adminID

    User.findAll({
        where: {adminID : AssociatedAdmin}
    })
    .then(
        function mySubUsers(data){
            res.json(data)
        },
        function getSubUsersFail(){
            res.status(500).send({error: '500 - Internal Service Error' })
        }
    );
});

router.get('/sub-users/:id', adminValidation, function(req, res){
    let data = req.params.id
    let AssociatedAdmin = req.user.adminID

    User.findOne({
        where: {
            id : data,
            adminID : AssociatedAdmin
        }
    })
    .then(
        function getOneSubUser(data){
            res.json(data)
        },
        function getOneSubUserFail(){
            res.status(500).send({error: '500 - Internal Service Error' })
        }
    );
});


router.delete('/delete_account/:id', sessionValidation, function(req, res){
    let data = req.params.id;

    User.destroy({
        where: { 
            id : data,
        }
    }).then(
        function deleteUserSuccess(){
            res.send('What user?');
        },
        function deleteUserError(){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

router.put('/update_account/:id', sessionValidation, function(req, res){
    let data = req.params.id;
    let userid = req.user.id;
    let newUsername = req.body.user.username
    let newPasswordhash = req.body.user.password

    User.update({
        username : newUsername,
        password : bcrypt.hashSync(newPasswordhash, 10)
    },  { where: { 
           id : data,
           id : userid
        }
    }).then(
        function userUpdated(updateUserAccount){
            res.json({
                message: 'Entry updated, check your training log to confirm accuracy',
                updateUserAccount
            });
        },
        function updateError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});
module.exports = router;

    
//     let admin = req.body.user.is_admin;

//     (admin === true) ? User.findOne({
//        where : { username : req.body.user.username, adminID : req.body.user.adminID } 
//        }).then(user => {console.log(user)
//         if(user){
//             let user = req.body.user;
        
//                     bcrypt.compare(req.body.user.adminID, user.adminID, function(err, adminMatch){
//                         if(adminMatch){
//                             bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
//                                 if(authMatch){
//                                     let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
//                                     let aToken = jwt.sign({id: user.id}, process.env.SIGN, {expiresIn: 60*60*16});
//                                     res.json({
//                                         adminID : user,
//                                         message : 'Welcome back',
//                                         sessionToken : token,
//                                         adminToken : aToken
//                                     });
//                                 } else {
//                                     res.status(502).send({ error: "502/Bad Gateway - if only you were Jeff Bezos..." })
//                                 }
//                             },
//                             function(){
//                                 res.status(501).send({ error: "501 - Get off twitter, Elon!" })
//                             });
//                         } else {
//                             res.status(500).send({ error: "500 - You're not Sir Richard Branson!"})
//                         }
//                     },
//                     function(){
//                         res.status(501).send({ error: "501 - Get off twitter, Elon!" })
//                     });
//                 } else {
//                     res.status(500).send({ error: "500 - something, something...innovation"})
//                 }
//             }
//         )
//     : User.findOne({
//         where : { username : req.body.user.username }
//         }).then(function(user){ 
//                 if(user){
//                     // console.log(user);
//                     bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
//                         if(authMatch){
//                             let token = jwt.sign({id: user.id}, process.env.SIGN, {expiresIn: 60*60*16});
//                             res.json({
//                                 username: user,
//                                 message: 'Welcome back',
//                                 sessionToken: token
//                             });
//                         } else {
//                             res.status(502).send({ error: "502/Bad Gateway - if only you were Jeff Bezos..." })
//                         }
//                     });
//                 } else {
//                     res.status(500).send({ error: "500 - You're not Sir Richard Branson!"})
//                 }
//             },
//             function(){
//                 res.status(501).send({ error: "501 - Come back when you own one of the following: A) SpaceX, B) Virgin, or C) Amazon"  })
//             }
//         );
//     }
// );