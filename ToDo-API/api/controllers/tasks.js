const mongoose = require('mongoose');

//imports object product 
const Task = require('../models/task');
const User = require('../models/user');

exports.tasks_get_all = (req, res, next) => {
    userId = req.params.userId
    Task.find({author: userId})
    .select('title description _id date author')
    .populate('author', '_id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            tasks: docs.map(doc => {
              return {
                _id: doc._id,
                title: doc.title,
                description: doc.description,
                date: doc.date,
                author: doc.author,
                request: {
                  type: "GET",
                  url: "http://localhost:5000/tasks/" + doc._id +'/'+ doc.author
                }
            };
        })
    });
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });


}

exports.tasks_create_task = (req, res, next) => {
    User.findById(req.body.userId)
    .populate('author', '_id')
    .exec()
    const task = new Task({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        author:req.body.userId
   });
       return task.save()
   .then(result => {
        console.log(result);
        res.status(200).json ({
            message: 'Created Task sucessfully',
            createdTask: {
                title: result.title,
                description: result.description,
                _id: result.id,
                date: result.date,
                author: result.author,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/tasks/' + result._id + '/' + result.author
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });

}

exports.tasks_get_task = (req, res, next) => {
    const id = req.params.taskId;
    const user = req.params.userId;
    Task.find({author: user, _id: id})
    //Task.findById(id)
    .select('title description _id date')
    .populate('customer')
    .exec()
    .then(doc =>{
        console.log("From database",doc);
        if (doc) {
            res.status(200).json({
                task: doc,
                request: {
                    type: 'GET',
                    description: 'Get all tasks',
                    url: 'http://localhost:5000/tasks/' + user
                }
            });
        }
        else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

}

exports.tasks_update_task = (req, res, next) => {
    const id = req.params.taskId;
    const user = req.params.userId;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Task.update({author: user, _id:  id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Task updated successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:5000/tasks/' + id + '/' + user
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.statusMessage(500).json({error: err});
    });
}

exports.tasks_delete_task = (req, res, next) => {
    const id = req.params.taskId;
   Task.remove({_id: id})
   .exec()
   .then(result => {
       res.status(200).json({
          message: 'Task deleted',
          request: {
              type: 'POST',
              description: 'Create a new task ',
              url: 'http://localhost:5000/tasks/' + id,
              body: {title: 'String', description: 'String', author:'userId'}
          } 
       });
   })
   .catch(err => {
       res.status(500).json({error: err});
   });
}