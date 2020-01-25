// create an java object called task
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	title:{type:String, required:true},
	description: {type:String, required:true},
    date: {type: Date, default: Date.now},
    author:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}//is the product object from user.js
});

module.exports = mongoose.model('Task', taskSchema);