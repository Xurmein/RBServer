var router = require('express').Router();
var sequelize = require('../db');
var validateSession = require('../middleware/validate-session')
var Content = sequelize.import('../models/content');

router.post('/new_post', validateSession, function (req, res){
    let userid = req.body.content.creator;
    let Creator = req.body.content.creator;
    let Label = req.body.content.label;
    let ContentText = req.body.content.content_text;

    Content.create({
        creator : Creator,
        label : Label,
        content_text : ContentText
    }, {where: {label : Label, creator : userid, content_text: ContentText }}
    ).then(
        function userPostSuccess(){
            res.json({
                message : 'Saved! See you Space Cowboy...',
                Label : req.body.content.label,
                Creator : req.body.content.creator
            }); 
        },
        function userPostError(){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

router.get('/userposts', validateSession, function(req, res){
    let Creator = req.user.username;

    Content.findAll({
        where: { creator : Creator }
    })
    .then(
        function myUserPosts(data){
            res.json(data)
        },
        function getAllFail(){
            res.status(500).send({error: '500 - Internal Service Error'});
        }
    );
});

router.get('/userposts/:id', validateSession, function(req, res){
    let data = req.params.id;
    let Creator = req.user.username;

    Content.findOne({
        where: { 
            id : data,
            creator : Creator
        }
    }).then(
        function findOneUserPost(data){
            res.json(data);
        },
        function noFindUserPost(){
            res.status(500).send({error : '500 - Internal Service Error'})
        }
    )
})

router.delete('/userposts/delete/:id', validateSession, function(req, res){
    let data = req.params.id;
    let Creator = req.user.username;

    Content.destroy({
        where: { 
            id : data,
            creator : Creator
        }
    }).then(
        function deleteUserSuccess(data){
            res.send('What Journal entry?');
        },
        function deleteUserError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

router.put('/userposts/edit/:id', validateSession, function(req, res){
    let data = req.params.id;
    let Creator = req.user.username;
    
    let Label = req.body.content.label;
    let ContentText = req.body.content.content_text;

    Content.update({
        label : Label,
        content_text : ContentText
    },  { where: { 
            id : data,
            creator : Creator
        }
    }).then(
        function userpostUpdated(updateUserPost){
            res.json({
                message: 'Entry updated, check your training log to confirm accuracy',
                updateUserPost
            });
        },
        function updateError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

module.exports = router;