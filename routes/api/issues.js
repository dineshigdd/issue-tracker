const express = require('express');
const router = express.Router();
var axios = require('axios')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateIssueInput = require('../../validation/issue')

const { session } = require('passport');
const { param } = require('./users');
const project = require('../../validation/project');
const { findOne } = require('../../models/Issue');
const Project = require('../../models/Project');
const Issue = require('../../models/Issue');
const IssueController = require('../../controllers/issue-controller');



//to create new issue for the selected project
router.get('/manage/:project_id', ( req, res) => {
    console.log("in issue:" + req.params.project_id)
 
  res.render("issue", {  nameData: req.params.data } )
});

//to update existing issue for the selected project
// router.get('/manage/:data', ( req, res) => {
//     res.render("issue", {  nameData: req.params.data } )
//  //    res.render("issue", {  nameData: req.params.data } )
//  });

//get issue of a specified project
router.get('/:id', IssueController.projectIssues )
// router.get('/:id', ( req, res , next ) => {
    
//     Issue.find( { project: ObjectId(req.params.id) }, ( err , issues ) => {
//         if( err ) {
//             return next( err )
//         }
//          res.json(issues)
        
//     })
    // Project.findById({ _id: req.params.id })
    //     .then(
    //         project => {
    //             Issue.find( { project: project._id }, ( err , issues ) => {
    //                 if( err ) {
    //                     return next( err )
    //                 }
    //                  res.json(issues)
                    
    //             })
    //         }
    //     )
// });

//testing post
// router.post('/:project_name',( req,res) => {
//         console.log(req.params.project_name)
// })
// passport.authenticate('jwt', {session: false })

//post issue
router.post('/', ( req, res) => {
    console.log( " req.body.id:" + req.body.id)
    console.log( " req.body.id:" + req.body.issue.issue_title)
    // req.session.projectID = req.body.id;
    // IssueController.addNewIssues;
    // console.log(  req.session.projectID)
    axios.post('http://' + req.headers.host + '/api/issues/'+ req.body.id,req.body.issue,{
        headers:{
            'Authorization':req.session.token
        }
    })
    .then(function (response) {           

        res.send( response.data);
      
        
        })
        .catch( err => console.log);
    
});


router.post('/:id', passport.authenticate('jwt', {session: false }), async (req, res) => {
     
    const { error, isValid } = validateIssueInput( req.body );

           
    if( isValid){
       
        return res.status(400).json({"error": error })
    }

     
    //find the project         
    Project.findById({ _id: req.params.id })
        .then( project =>  {
          
    //  create an issue
    const newIssue = new Issue({
            issue_title : req.body.issue_title,
            issue_text : req.body.issue_text,
            created_by: req.user.id,    
            assigned_to: req.body.assigned_to,
            status_text:req.body.status_text,
            open:req.body.open,
            project:project._id
        });

        
         newIssue.save(err => {
            if( err ){
                if(err.name ===  'MongoError' && err.code === 11000){
                    return res.json('There was a duplicate key error');
                }
            }
            res.json( newIssue )
        
        })

    })

})


//delete issue
router.delete("/:id",async ( req, res , next ) => {
    
    Issue.findByIdAndRemove( { _id: req.params.id},( err , issue ) => {

        if( err ) {
            return next( err)
        }

        res.json(issue)
    })
})

router.put('/', ( req, res) => {
    console.log( " req.body.id:" + req.body.id)
    console.log( " req.body.id:" + req.body.issue.issue_title)
    
    axios.put('http://' + req.headers.host + '/api/issues/'+ req.body.id, req.body.issue,{
        headers:{
            'Authorization':req.session.token
        }
    })
    .then(function (response) {           

        res.send( response.data);
      
        
        })
        .catch( err => console.log);
    
});

//update issue
router.put("/:id",  passport.authenticate('jwt', {session: false }),
async ( req, res, next ) => {
  console.log("update route"+ req.body.id)
    Issue.findByIdAndUpdate( { _id: req.body.id })
        .then(issue =>  {
            console.log(issue)
            const { 
                issue_title,
                issue_text , 
                assigned_to,
                status_text,
                open                
            }   = req.body;

            issue.issue_title = issue_title;
            issue.issue_text = issue_text;
            issue.assigned_to = assigned_to;
            issue.status_text = status_text;
            issue.open = open;            ;
            issue.save( err => {
                if( err ){
                    return next(err)
                }
                
                return res.json( issue );
            }
                
            )
           
        });
    
})
    
module.exports = router;