var axios = require('axios');
const { response } = require('express');

exports.myprojects = function(req , response){   
        
    
         axios.get(`http://${req.headers.host}/api/projects/projects`,{
            headers:{
                'Authorization': req.session.token 
            }
        })
        .then(function (res) {
                      if( res.data.length === 0 ){
                           return response.render('project', { message: "You have no projects"});
                      }else{
                           return response.render('project',{ project:res.data , message: "Your projects" })    
                      }   
        })
        .catch( err => console.log(err));

    };


  exports.getProjectDashboard = function( req, response ){
        axios.get(`http://${req.headers.host}/api/projects/dashboard`,{
            headers:{
                'Authorization': req.session.token 
            }
        })
        .then(function (res) {                      
                return response.render( res.data );
                     
        })
        .catch( err => {
            console.log( err );
            response.redirect('/')
        });
  };


  exports.setNewProject = function( req, response ){
 
      
    axios.post(`http://${req.headers.host}/api/projects/project`,
       
        { data:  req.body },
    
        
        { headers:{'Authorization': req.session.token }}
        )
    .then(function (res) {   
        
                    //  console.log( "successful attemp")
             response.send( res.data );
                 
    })
    .catch( err => {
        response.send( err );
        // response.redirect('/')
    });
};