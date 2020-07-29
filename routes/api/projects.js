const express = require('express');
// const app = express();
const router = express.Router();
const passport = require('passport');
const validateProjectInput = require('../../validation/project');
const Project = require('../../models/Project');
const User = require('../../models/User');
const checkisAuthenticated = require('../../util/route_auth');

// app.set('view engine', 'pug')
// app.set("views", path.join(__dirname, "../../views"));

router.get('/my-project', passport.authenticate('jwt', {session: false}), (req, res) => {

    // res.json(req.body.email)
    // User.findOne({ email: req.body.email }).then(
    //     user => 
        // res.json((req.params.email))
        console.log("this is in project "+ req.user.id)
        
        Project.findOne({ assigned_to:  req.user.id }).then(
            (project, err) => {
                if( err ){
                    console.log(err)
                }
                res.render("project", {  project:   project.project_name} )
            }
        ).catch(err => res.json( err ))

       
       
    // )
   

   
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