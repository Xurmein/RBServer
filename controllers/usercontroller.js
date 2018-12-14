require('dotenv').config();

var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
//const validateSession = require('../middleware/validate-session');
const validateSession = require('../middleware/validate-admin');
// const Op = sequelize.Op

router.post('/register', function (req, res) {
    let Username = req.body.username;
    let passwordhash = req.body.password;
    let admin = req.body.is_admin;
    let adminEmail = req.body.adminID;

    //if(admin === true){
    User.create({
        username: Username,
        password: bcrypt.hashSync(passwordhash, 15),
        is_admin: admin,
        email: email
    }).then(
        function signupSuccess(user) {
            // let aToken = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*3} );
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
            res.json({
                user: user,
                message: 'New User Created!',
                sessionToken: token,
                // adminToken : aToken,
            })
        },
        function createUserFail(err) {
            res.status(500).send({ error: '500 - Internal server Error' })
        }
    )
        .then(
            function createUserSuccess(user) {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                res.json({
                    user: user,
                    message: 'Successfully registered as user!',
                    sessionToken: token
                });
            },
            function createUserFail(err) {
                res.status(500).send({ error: '500 - Internal Server Error' })
            }
        )
}
)


router.post('/login', function (req, res) {
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    console.log(username, email, password)

    User.findOne({
        where: { [Op.or]: [{ email: email }, { username: username }] }
    })
        .then(
            function LoginSuccess(user) {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, matches) {
                        if (matches) {
                            // let aToken = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*3} );
                            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
                            res.json({
                                user: user,
                                message: `Welcome back, ${user.username}`,
                                sessionToken: token,
                                //adminToken : aToken,
                            });
                        } else {
                            res.status(502).send({ error: "502/Bad Gateway" })
                        }
                    });
                } else {
                    res.status(500).send({ error: "Have you registered yet?" })
                }
            },
            function (error) {
                res.status(501).send({ error: "Here be dragons--turn back! Also, get in touch with the idiot that made this site..." })
            })

    router.get('/all', async (req, res) => {
        User.findAll()
            .then(
                findAllSuccess = (employee) => {
                    res.status(200).json({
                        employee
                    })
                },

                findAllError = (err) => {
                    res.status(500).send("Could not get all")
                }
            )
    })

    router.get('/:id', validateSession, (req, res) => {
        User.findOne({ where: { id: req.params.id } })
            .then(user => res.status(200).json(user))
            .catch(err => res.status(500).json(err))
    })

    router.put('/update/:id', validateSession, (req, res) => {
        User.update({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        },
            { where: { id: req.params.id } }
        ).then(
            function successUpdated(user) {
                res.status(200).json({
                    User: user,
                    message: "User updated successfully"
                })
            },
            function failUpdate(err) {
                res.status(500).json({
                    message: err.message
                })
            }
        )
    })

    router.delete('/delete/:id', validateSession, (req, res) => {
        User.destroy({
            where: { id: req.params.id }
        })
            .then(
                function deleteSuccess(user) {
                    res.status(200).json({
                        User: user,
                        message: 'User deleted successfully'
                    })
                },
                function deleteFail(err) {
                    res.status(500).json({
                        error: err.message
                    })
                }
            )
    })
})
module.exports = router;

