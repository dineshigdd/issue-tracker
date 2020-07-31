const Project = require('../models/Project');
const { compareSync } = require('bcryptjs');
var myproject='';
module.exports = { 
    setUserProjects: function setUserProjects( id ){
   
        Project.findOne({ assigned_to:  id }).then(
            (project, err) => {
                if( err ){
                    console.log(err)
                }
                myproject = (project.project_name) ;
                
            }
        ).catch(err => console.log( err ))

  
    },

    getUserProjects : function getUserProjects(){
       
        return myproject;
    }
}