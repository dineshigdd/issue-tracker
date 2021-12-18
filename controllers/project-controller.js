var axios = require('axios');
const { response } = require('express');

exports.myprojects = function(req , response){   
        
    
        //  axios.get('http://' + req.headers.host + '/api/projects/my-project',{
        //     headers:{
        //         'Authorization': req.session.token 
        //     }
        // })
        // .then(function (res) {
        //               if( res.data.length === 0 ){
        //                    return response.render('dashboard-project');
        //               }else{
        //                    return response.render('dashboard-project',{ project:res.data })    
        //               }   
        // })
        // .catch( err => console.log(err));

    };


  exports.getProjectDashboard = function( req, response ){
        axios.get(`http://${req.headers.host}/api/projects/dashboard`,{
            headers:{
                'Authorization': req.session.token 
            }
        })
        .then(function (res) {                      
                response.render( res.data );
                     
        })
        .catch( err => {
            console.log( err );
            response.redirect('/')
        });
  };


  exports.setNewProject = function( req, response ){
      console.log( req.session.token )
    axios.get(`http://${req.headers.host}/api/projects/project`,{
        headers:{
            'Authorization': req.session.token 
        }
    })
    .then(function (res) {       
                     console.log( "successful attemp")
            // response.render( res.data );
                 
    })
    .catch( err => {
        console.log( "This is an error" );
        // response.redirect('/')
    });
};