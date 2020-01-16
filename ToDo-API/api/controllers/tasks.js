const mongoose = require('mongoose');

//imports object product 
const Task = require('../models/task');
const User = require('../models/user');

exports.tasks_get_all = (req, res, next) => {
    Task.find()
    .select('title description _id date')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            task: docs.map(doc => {
                return {
                    title: doc.title,
                    description: doc.description,
                    _id: doc.id,
                    date: doc.date,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/tasks/' + doc._id
                    }
                };
            })
        };
        if (docs.length >= 0) {
            res.status(200).json(response);
        }else {
            res.status(404).json({message: "No entries found"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });


}

exports.tasks_create_task = (req, res, next) => {
    const task = new Task({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        author:req.user._id
    });
    task.save().then(result => {
        console.log(result);
        res.status(200).json ({
            message: 'Created Task sucessfully',
            createdTask: {
                title: result.title,
                description: result.description,
                _id: result.id,
                date: result.date,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/tasks/' + result._id
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
    Task.findById(id)
    .select('title description _id date')
    .exec()
    .then(doc =>{
        console.log("From database",doc);
        if (doc) {
            res.status(200).json({
                task: doc,
                request: {
                    type: 'GET',
                    description: 'Get all tasks',
                    url: 'http://localhost:5000/tasks'
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
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Task.update({_id:  id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Task updated successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:5000/tasks/' + id
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
              url: 'http://localhost:5000/tasks',
              body: {title: 'String', description: 'String'}
          } 
       });
   })
   .catch(err => {
       res.status(500).json({error: err});
   });
}