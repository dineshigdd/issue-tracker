const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const IssueSchema = new Schema({

      
        issue_title: { type: String , required: true },
        issue_text:  { type: String,  required: true },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        assigned_to: { type: String },
        status_text: { type: String },
        open:        { type: Boolean , required: true},
        
        project:{
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },        
        },   
        
       {
        timestamps : { createdAt : 'created_on', type: Date }, 
        timestamps:  { updatedAt : 'updated_on', type: Date}  
        
    }
        

);

module.exports = Issue = mongoose.model('Issue', IssueSchema );