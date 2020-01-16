// create an java object called product
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title:{type:String, required:true},
    description: {type:String, required:true},
    date: {type: Date, default: Date.now},
    author:{type:String, required:true}
});

module.exports = mongoose.model('Task', taskSchema);