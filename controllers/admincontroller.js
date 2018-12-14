require('dotenv').config();

var express = require('express');
var router = express.Router();
var sequelize = require('../db');
const Admin = sequelize.import('../models/admin');
var jwt =  require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validate-admin');

router.post('/register', (req, res) => {
    let adminID = req.body.adminID
    let password = req.body.password
    let email = req.body.email

    Admin.create({
        adminID: adminID,
        password: bcrypt.hashSync(password, 10),
        email: email
    })
    .then(
       signupSuccess = (admin) => {
           var token = jwt.sign({id: admin.id}, process.env.JWT_SECRET, { expiresIn: 60*60*24})
           res.json({
               admin: admin,
               message: "Created Admin",
               sessionToken: token
           })
       },
       createError = err => res.send(500, err)
    )
})

router.post('/login', (req, res) => {
    let adminID = req.body.adminID
    let password = req.body.password
    let email = req.body.email
    Admin.findOne({ where: {[Op.or]: [{email: email}, {adminID: adminID}]}})
    .then(
        (admin) => {
            if (admin) {
                bcrypt.compare(password, admin.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({ id: admin.id}, process.env.JWT_SECRET)
                        res.json({
                            admin: admin,
                            message: "Authenticated",
                            sessionToken: token
                        })
                        } else {
                            res.status(502).send({error: "failed to find admin" })
                        }
                })
            } else {
                res.status(500).send({ error: "failed to authenticate admin" })
            }
        },
        function (err) {
            res.status(501).send({ err: "something is not right" })
        }
    )
})
module.exports = router;