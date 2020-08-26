var axios = require('axios')
const {ObjectId} = require('mongodb');
const util = require('../util/curd')
const issue = require('../validation/issue');

exports.projectIssues = ( req, res , next ) => {
    var arr = [];
    Issue.find( { project: ObjectId(req.params.id) }, ( err , issues ) => {
        if( err ) {
            return next( err )
        }

        // issues.forEach( element => {
        //     arr.push( { id: element._id, issue_title: element.issue_title })
        // })
        
        res.send(issues)
       
         
                           
    })
        
}

exports.addNewIssues =  function(req , response){   
    
    console.log("in controller" + req.session.projectID)
    const token = req.session.token
   
    //this where I stopped on 8/23/ 
    //has issueses with response
    
     
  }