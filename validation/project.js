const Validator = require('validator');

module.exports = function validateProjectInput(data){
    let error = {};

    
   if( Validator.isEmpty( data.project_name )){
         error.message = "Project name is rquired"
   }

   if( Validator.isEmpty( data.project_description )){
        error.message = "project description is required";
   }

   return { error, 
            isValid: Object.keys(error).isLength === 0
        }
}