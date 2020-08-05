const express = require('express');
const router = express.Router();
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


//get issue management page
router.get('/manage/:issue', ( req, res) => {
    //console.log( req.params.issue )
    res.render("issue", {  issues: req.params.issue } )
});

//get issue of a specified project
router.get('/:project_name', ( req, res , next ) => {
  
    Project.findOne({ project_name: req.params.project_name })
        .then(
            project => {
                Issue.find( { project: project._id }, ( err , issues ) => {
                    if( err ) {
                        return next( err )
                    }
                     res.json(issues)
                    
                })
            }
        )
});

//post issue
router.post('/:project_name',passport.authenticate('jwt', {session: false }),
    (req, res) => {
        const { error, isValid } = validateIssueInput( req.body );

               
        if( isValid){
           
            return res.status(400).json({"error": error })
        }

            
        //find the project         
        Project.findOne({ project_name: req.params.project_name })
            .then( project =>  {
              
        //  create an issue
        const newIssue = new Issue({
                issue_title : req.body.issue_title,
                issue_text : req.body.issue_text,
                created_by: req.user.id,
                assigned_to:'',
                status_text:'',
                open:false,
                project:project._id
            });

            
             newIssue.save(err => {
                if( err ){
                    if(err.name ===  'MongoError' && err.code === 11000){
                        return res.json('There was a duplicate key error');
                    }
                }
            res.json(newIssue)
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

//update issue
router.put("/:id",async ( req, res, next ) => {
  
    Issue.findByIdAndUpdate( { _id: req.params.id })
        .then(issue =>  {
            
            const { 
                issue_title,
                issue_text , 
                // created_by,
                status_text,
                open
                // project
            }           = req.body;
    
            issue.issue_title = issue_title;
            issue.issue_text = issue_text;
            // issue.created_by = created_by;
            issue.status_text = status_text;
            issue.open = open;
            // issue.project = project;
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