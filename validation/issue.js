const Validator = require('validator');

module.exports = function validateIssueInput(data){
    let error = {};

    
   if( Validator.isEmpty( data.issue_title )){
         error.message = "Title is rquired"
   }

   if( Validator.isEmpty( data.issue_text )){
        error.message = "A description of the issue is required";
   }

   return { error, 
            isValid: Object.keys(error).isLength === 0
        }
}