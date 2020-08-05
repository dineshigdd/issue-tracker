const Project = require('../models/Project');
const { compareSync } = require('bcryptjs');
const { deleteOne } = require('../models/Project');
var myproject;
module.exports = { 
    setUserProjects: async function setUserProjects( id , callback){
   
        Project.find({ assigned_to:  id }).then(
             function ( project,err ) {
                if( project ){
                    console.log(err)
                }
                
              
                // setAllprojects(project)
                
                // myproject = project;
                callback(null,project)
                // return myproject;
               // myproject.push(project.project_name) ;
                
            }
        )    
        .catch(err => console.log("err"+ err ))

  
    },

    getUserProjects : function getUserProjects() {
        //  console.log("size:" + myproject);
        return myproject;
    }
}


