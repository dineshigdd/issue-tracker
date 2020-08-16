var axios = require('axios')

exports.myprojects = function(req , res){    
    axios.get('api/projects/my-project/',{
        headers:{
            'Authorization': localStorage.getItem('jwtToken')
        }
    })
    .then(function (res) {           

           res.render( res.data );       
        
        })
        .catch(function (error) {
            console.log(error);
        });
  }