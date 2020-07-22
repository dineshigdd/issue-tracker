const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

UserSchema = new Schema({
    first_name: { type: String, required: true }, 
    last_name: { type: String, required: true }, 
    email: { type: String, required: true , unique: true}, 
    password:{ type: String, required: true }, 
    project_assigned: {
        type: Schema.Types.ObjectId,
        ref: 'Project'        
    }
})


module.exports = User = mongoose.model('User', UserSchema);