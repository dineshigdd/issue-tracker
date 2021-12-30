const express = require('express');
// const app = express();
const router = express.Router();
const passport = require('passport');
const axios = require('axios')
const url = require('url');
const validateProjectInput = require('../../validation/project');
const Project = require('../../models/Project');
const User = require('../../models/User');
const checkisAuthenticated = require('../../util/route-auth');
const userProject = require('../../util/userProjects');
const { compareSync } = require('bcryptjs');
const setUserProjects = userProject.setUserProjects;
const getUserProjects = userProject.getUserProjects;
var projectController = require('../../controllers/project-controller');

 
 router.get('/projectdashboard', projectController.getProjectDashboard);
// router.get('/dashboard', passport.authenticate('jwt', {session: false }), ( req , res ) => {
//     return res.data;
// });




 router.get('/dashboard', passport.authenticate('jwt', {session: false }), ( req , res ) => {
        res.send( 'dashboard' );
 });

// router.get('/dashboard', passport.authenticate('jwt', {session: false }), ( req , res ) => res.send('dashboard'));

router.get('/project', ( req , res ) => {  
   
    if(  req.session.token ){
            res.render('project-form')
    }else res.redirect('/');
})

//get All projects
router.get('/getprojects', projectController.myprojects );
router.get('/projects', passport.authenticate('jwt', {session: false }), (req, res) => {
        console.log("I am in project")
       // console.log("this is in project "+ req.user.id)
        // res.render('test')
            
         setUserProjects(req.user.id, function(err, project){
             if(err){
                 console.log(err)
             }
             return res.send( project  )          
             
         })
        
       
  });

router.post("/newproject", projectController.setNewProject );

router.post("/project",  passport.authenticate('jwt', {session: false }), ( req, res ) => {
    
           
    //validate input feilds

          
            const { error , isValid } = validateProjectInput( req.body.data );
            const { project_name, project_description } = req.body.data;
            
            console.log( project_name + "\n" +     project_description + "\n" +
                         req.user.id
            );

            if( isValid){
            
                return res.status(400).json({"error": error })
            }

           
            //create project 
            const project = new Project({
                project_name: project_name,
                project_description: project_description,
                assigned_to: req.user.id
            })

            //save to db
            project.save()
                   .then( res.json( project ))
                   .catch( err => {
                       if( err.name === 'MongoError' && err.code === 11000 ){
                                        return res.json('There was a duplicate key err');
                                    }              
                        
                    })
            
    
})


router.put("/:id",  passport.authenticate('jwt', {session: false }),
async ( req, res, next ) => {
  console.log("update route"+ req.body.id)
    Project.findByIdAndUpdate( { _id: req.body.id })
        .then(project =>  {
            console.log(project);

            const { project_name, project_description }   = req.body;

            project.save( err => {
                if( err ){
                    return next(err)
                }
                
                return res.json( project );
            }
                
            )
           
        });
    
})


router.delete("/:id",async ( req, res , next ) => {
    console.log(req.params.id )
    Project.findByIdAndRemove( { _id: req.params.id},( err , project ) => {

        if( err ) {
            return next( err)
        }

        res.json(project)
    })
    // res.send("msg from delete route")
})

module.exports = router;