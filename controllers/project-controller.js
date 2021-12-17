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


  exports.getProjectDashboard = function( req, response){
            axios.get(`http://${req.headers.host}/api/projects/dashboard`,{
            headers:{
                'Authorization': req.session.token 
            }
        })
        .then(function (res) {                      
                response.render(res.data ,{ "test": "test "});
                     
        })
        .catch( err => {
            console.log( err );
            response.redirect('/')
        });
  }

  exports.test = function( path  ) {
      console.log( path )
  }