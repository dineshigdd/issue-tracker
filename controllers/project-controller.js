var axios = require('axios')

exports.myprojects = function(req , response){   
    
    const token = req.session.token
    
     axios.get('http://' + req.headers.host + '/api/projects/my-project',{
        headers:{
            'Authorization':token
        }
    })
    .then(function (res) {           

        response.render('project',{ project:res.data })       
      
        
        })
        .catch( err => console.log);
  }