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

router.get('/', projectController.myprojects);


router.get('/my-project', passport.authenticate('jwt', {session: false }), (req, res) => {
        console.log("I am in project")
       // console.log("this is in project "+ req.user.id)
        // res.render('test')
            
         setUserProjects(req.user.id, function(err, project){
             if(err){
                 console.log(err)
             }
             res.send( project  )          
             
         })
        
       
  });

router.post("/project",passport.authenticate('jwt', {session: false }),
    async ( req, res ) => {
    //validate input feilds
    const { error , isValid } = validateProjectInput( req.body );
    const { project_name, project_description } = req.body;
      
    if( isValid){
      
        return res.status(400).json({"error": error })
    }

  
    //create project 
    const newProject = new Project({
        project_name: project_name,
        project_description: project_description,
        assigned_to: req.user.id
    })

    //save to db
     newProject.save(err => {
        if( err ){
            if( err.name === 'MongoError' && err.code === 11000 ){
                return res.json('There wa a duplicate key err')
            }
        }
        res.json(newProject)
        })
            .then( project => res.json( project)
            .catch( err => console.log( err ))
    )
})


module.exports = router;