const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    project_name: { type: String, required: true },
    project_description: { type:String, required: true},
    assigned_to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
})


module.exports = Project = mongoose.model('Project', ProjectSchema );



